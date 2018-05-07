// HTTP Client
const axios = require('axios');

// Config
const config = require('config');
const apiUrl = config.get('apiUrl');
const ipsUrl = config.get("ipsUrl") + "/agenda/api/jobs/create";

// Feathers Errors
const errors = require("@feathersjs/errors");

// Helpers
const generateId = require("../../../helpers/generate-id");

module.exports = function () {
  return async function (context) {

    const jobId = generateId();

    // Fake Job id when testing
    if (process.env.NODE_ENV == 'test' && context.data.fakeIpsInitAnalysisSuccess) {
      context.data = Object.assign(context.data, {
        status: "analysing",
        error: null,
        jobId: jobId
      });
      return context;
    }

    await axios
      .post(ipsUrl, {
        jobName: "process image",
        jobSchedule: "now",
        jobData: {
          image: {
            url: `${apiUrl}/files/${context.data.blobId}`
          },
          webhookUrl: `${apiUrl}/samples/analysis/${jobId}`
        }
      })
      .then(() => {
        context.data = Object.assign(context.data, {
          status: "analysing",
          error: null,
          jobId: jobId
        });
        return context;
      })
      .catch(err => {
        throw new errors.GeneralError('O serviço de imagens está indisponível. Por favor, tente novamente mais tarde.');
      });
  };
};
