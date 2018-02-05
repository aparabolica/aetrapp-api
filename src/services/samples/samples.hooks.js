const axios = require("axios");
const errors = require("@feathersjs/errors");
const fs = require("fs");
const shortid = require("shortid");
const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  restrictToOwner,
  associateCurrentUser
} = require("feathers-authentication-hooks");

const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "ownerId"
  })
];

const storeBlob = function() {
  return function(hook) {
    const blobService = hook.app.service("uploads");
    return blobService.create({ uri: hook.data.base64 }).then(res => {
      hook.data.blobId = res.id;
      return hook;
    });
  };
};

// create analysis job
const registerAnalysisJob = function() {
  return function(hook) {
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
        samples.patch(hook.result.id, {
          status: "invalid",
          error: {
            code: "500",
            message: "Erro no servidor de análise."
          }
        });
      });
  };
};

const checkTrapId = function() {
  return function(hook) {
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
    patch: [...restrict],
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
