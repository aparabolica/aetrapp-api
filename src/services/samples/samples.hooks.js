const axios = require("axios");
const errors = require("@feathersjs/errors");
const fs = require("fs");
const shortid = require("shortid");
const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  restrictToOwner,
  associateCurrentUser
} = require("feathers-authentication-hooks");
const {
  iff
} = require("feathers-hooks-common");


const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "ownerId"
  })
];

const storeBlob = function () {
  return function (hook) {
    const blobService = hook.app.service("uploads");
    return blobService.create({ uri: hook.data.base64 }).then(res => {
      hook.data.blobId = res.id;
      return hook;
    });
  };
};

// create analysis job
const registerAnalysisJob = function () {
  return function (hook) {
    const ipsUrl = hook.app.get("ipsUrl") + "/agenda/api/jobs/create";
    const samples = hook.app.service("samples");
    const jobId = shortid.generate();
    axios
      .post(ipsUrl, {
        jobName: "process image",
        jobSchedule: "now",
        jobData: {
          image: {
            url: `${hook.app.get("siteUrl")}/files/${hook.result.blobId}`
          },
          webhookUrl: `${hook.app.get("siteUrl")}/samples/analysis/${jobId}`
        }
      })
      .then(res => {
        samples.patch(hook.result.id, {
          status: "analysing",
          error: null,
          jobId: jobId
        });
      })
      .catch(err => {
        let errorMessage = "Erro ao solicitar serviço de análise."
        if (err.code == "ECONNREFUSED") errorMessage = "Serviço de análise não está disponível";
        samples.patch(hook.result.id, {
          status: "unprocessed",
          error: {
            code: "500",
            message: errorMessage
          }
        });
      });
  };
};

const checkTrapId = function () {
  return function (hook) {
    hook.app
      .service("traps")
      .get(hook.data.trapId)
      .then(trap => {
        if (trap) return hook;
        else new errors.BadRequest("Invalid trapId");
      })
      .catch(err => {
        return err;
      });
  };
};

const loadSample = function () {
  return function (hook) {
    return hook.app
      .service("samples")
      .get(hook.id)
      .then(sample => {
        if (sample) {
          hook.sample = sample;
          return hook;
        }
        else new errors.BadRequest("Could not find sample.");
      })
      .catch(err => {
        return new errors.GeneralError("Internal error.");
      });
  };
};

const startAnalysis = function () {
  return function (hook) {
    return registerAnalysis(hook)
      .then(res => {
        return hook;
      })
      .catch(err => {
        return new errors.GeneralError(err.message);
      })
  }
}

const registerAnalysis = function (hook) {
  const sample = hook.sample || hook.result;
  const ipsUrl = hook.app.get("ipsUrl") + "/agenda/api/jobs/create";
  const samples = hook.app.service("samples");
  const jobId = shortid.generate();
  if (hook.method == "patch") hook.data.jobId = jobId;
  return axios
    .post(ipsUrl, {
      jobName: "process image",
      jobSchedule: "now",
      jobData: {
        image: {
          url: `${hook.app.get("siteUrl")}/files/${sample.blobId}`
        },
        webhookUrl: `${hook.app.get("siteUrl")}/samples/analysis/${jobId}`
      }
    })
    .then(res=>{
      return hook;
    })
    .catch(err=>{
      return new errors.InternalError(err.message);
    })
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate("jwt"),
      checkTrapId(),
      associateCurrentUser({ idField: "id", as: "ownerId" }),
      storeBlob()
    ],
    update: [...restrict],
    patch: [
      ...restrict,
      iff(
        hook => { return hook.data && hook.data.status == "analysing" },
        loadSample(),
        startAnalysis()
      )
    ],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [registerAnalysisJob()],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
