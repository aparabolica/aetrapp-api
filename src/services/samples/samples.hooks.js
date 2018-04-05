const _ = require("lodash");
const axios = require("axios");

// Config
const config = require('config');
const apiUrl = config.get('apiUrl');

// Helper
const generateId = require("../../helpers/generate-id");

// Feathers & Sequelize
const Sequelize = require("sequelize");
const errors = require("@feathersjs/errors");
const fs = require("fs");
const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  restrictToRoles,
  associateCurrentUser
} = require("feathers-authentication-hooks");
const { iff, isProvider, fastJoin, getItems } = require("feathers-hooks-common");

/*
 * Hooks
 */

const restrict = [
  authenticate("jwt"),
  restrictToRoles({
    roles: ['admin'],
    idField: "id",
    ownerField: "ownerId",
    owner: true
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
    const ipsUrl = config.get("ipsUrl") + "/agenda/api/jobs/create";
    const samples = hook.app.service("samples");
    const jobId = generateId();
    axios
      .post(ipsUrl, {
        jobName: "process image",
        jobSchedule: "now",
        jobData: {
          image: {
            url: `${apiUrl}/files/${hook.result.blobId}`
          },
          webhookUrl: `${apiUrl}/samples/analysis/${jobId}`
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
  const jobId = generateId();
  if (hook.method == "patch") hook.data.jobId = jobId;
  return axios
    .post(ipsUrl, {
      jobName: "process image",
      jobSchedule: "now",
      jobData: {
        image: {
          url: `${apiUrl}/files/${sample.blobId}`
        },
        webhookUrl: `${apiUrl}/samples/analysis/${jobId}`
      }
    })
    .then(res => {
      return hook;
    })
    .catch(err => {
      return new errors.InternalError(err.message);
    })
}

const removeSameDayDuplicates = function (hook) {
  return function (hook) {
    const Op = Sequelize.Op;
    const samples = hook.app.service("samples");
    const sample = hook.sample || hook.result;

    return samples.find({
      query: {
        id: { [Op.ne]: sample.id },
        trapId: sample.trapId,
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }
    }).then(results => {

      // Remove found samples
      Promise.all(results.data.map(sample => {
        return samples.remove(sample.id);
      })).then(() => {
        return hook;
      });

    }).catch(err => {
      return new errors.GeneralError("Internal error.");
    });
  };
}

const addNotification = function () {
  return function (hook) {
    const sample = _.castArray(getItems(hook))[0];

    // "Sample is finished" notification
    hook.app
      .service("notifications")
      .create({
        recipientId: sample.ownerId,
        type: 'sample-analysis-finished',
        data: {
          sampleId: sample.id
        },
        title: "Análise de amostra concluída",
        message: "Estão disponíveis os resultados da amostra " + sample.id + "."
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });
  }
}

const sampleResolvers = {
  joins: {
    owner: (...args) => async (sample, context) => {
      const users = context.app.services['users'];
      try {
        sample.owner = (await users.get(sample.ownerId, {
          query: {
            $select: [ 'id', 'firstName', 'lastName' ]
          }
        }))
      } catch (error) {
        console.log(`User ${sample.ownerId} not found.`);
      }
    }
  }
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
        hook => { return hook.data && hook.data.status == "analysing" && !hook.data.jobId },
        [loadSample(), startAnalysis()]
      )
    ],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [fastJoin(sampleResolvers)],
    get: [fastJoin(sampleResolvers)],
    create: [registerAnalysisJob(), removeSameDayDuplicates()],
    update: [],
    patch: [iff(
      hook => { return hook.data && hook.data.status != "analysing" },
      addNotification())], // ips result
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
