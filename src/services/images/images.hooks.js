const errors = require('feathers-errors');
const fs = require('fs');
const axios = require('axios');
const { authenticate } = require("feathers-authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");

const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "id"
  })
];

const fakeData = hook => {
  hook.data.trapId = 1;
};

const storeBlob = function () {
  return function (hook) {
    const blobService = hook.app.service('uploads');
    return blobService.create({uri: hook.data.base64}).then(res => {
      hook.data.blobId = res.id;
      return hook;
    });
  }
};

const registerAnalysisJob = function () {
  const ipsUrl = 'http://172.22.0.1:3131/agenda/api/jobs/create';
  return function (hook) {
    return axios.post(ipsUrl, {
        "jobName": "process image",
        "jobSchedule": "now",
        "jobData": {
          "imageUrl": "https://github.com/aetrapp/image-processing-service/raw/master/samples/06.4SEM.CENC.INTRA.SONY.jpg",
          "webhookUrl": `http://172.23.0.1:3030/images/analysis/${hook.result.id}`
        }
    }).then(res => {
      return hook;
    }).catch(err => {
      return hook;
    });
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt'), fakeData, storeBlob() ],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ registerAnalysisJob() ],
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
