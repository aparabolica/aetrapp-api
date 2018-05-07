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
const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  restrictToRoles,
  associateCurrentUser
} = require("feathers-authentication-hooks");
const { iff, getItems } = require("feathers-hooks-common");

// Helper hooks
const { doResolver } = require('../../hooks');
const loadTrap = require('./hooks/load-trap');
const loadSample = require('./hooks/load-sample');
const matchTrapStatusToSample = require('./hooks/match-trap-status-to-sample');
const initAnalysis = require('./hooks/init-analysis');

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

const startAnalysis = function () {
  return function (hook) {
    return registerAnalysis(hook)
      .then(res => {
        return hook;
      })
      .catch(err => {
        if (err.code == 'ECONNREFUSED') {
          throw new errors.GeneralError("O serviço de processamento de imagens está indisponível.");
        } else {
          throw new errors.GeneralError("Não foi possível completar a ação, por favor, contate o suporte.");
        }
      });
  };
};

const registerAnalysis = function (hook) {
  const sample = hook.sample || hook.result;
  const ipsUrl = hook.app.get("ipsUrl") + "/agenda/api/jobs/create";
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
    });
};

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
};

const addNotification = function () {
  return function (hook) {
    const sample = _.castArray(getItems(hook))[0];

    // "Sample is finished" notification
    hook.app
      .service("notifications")
      .create({
        recipientId: sample.ownerId,
        payload: {
          type: 'sample-analysis-finished',
          deeplink: 'sample/' + sample.id,
          sampleId: sample.id
        },
        title: "Análise de amostra concluída.",
        message: "Estão disponíveis os resultados da amostra " + sample.id + "."
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });
  };
};


const sampleResolvers = {
  joins: {
    owner: (...args) => async (sample, context) => {
      const users = context.app.services['users'];
      try {
        sample.owner = (await users.get(sample.ownerId, {
          skipResolver: true,
          query: {
            $select: ['id', 'firstName', 'lastName']
          }
        }));
      } catch (error) {
        console.log(`User ${sample.ownerId} not found for sample ${sample.id}.`);
      }
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate("jwt"),
      associateCurrentUser({ idField: "id", as: "ownerId" }),
      loadTrap(),
      storeBlob(),
      initAnalysis()
    ],
    patch: [
      ...restrict,
      iff(
        hook => { return hook.data && hook.data.status == "analysing" && !hook.data.jobId; },
        [loadSample(), startAnalysis()]
      )
    ],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [doResolver(sampleResolvers)],
    create: [
      matchTrapStatusToSample(),
      removeSameDayDuplicates()
    ],
    patch: [
      iff(context => {
        return context.data && context.data.status;
      }, [
        loadTrap(),
        matchTrapStatusToSample()
      ]),
      iff(
        hook => { return hook.data && hook.data.status != "analysing"; },
        addNotification()
      )
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: []
  }
};
