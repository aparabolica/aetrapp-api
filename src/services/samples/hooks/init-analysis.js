// HTTP Client
const axios = require('axios');

// Config
const config = require('config');
const apiUrl = config.get('apiUrl');
const ipsUrl = config.get("ipsUrl") + "/agenda/api/jobs/create";

// Helpers
const generateId = require("../../../helpers/generate-id");

module.exports = function () {
  return function (context) {

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

    axios
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
      })
      .catch(err => {
        let errorMessage = "Erro ao solicitar serviço de análise.";
        if (err.code == "ECONNREFUSED") errorMessage = "O serviço de processamento de imagens está indisponível.";
        context.data = Object.assign(context.data, {
          status: "unprocessed",
          error: {
            code: "500",
            message: errorMessage
          }
        });
      });
  };
};
