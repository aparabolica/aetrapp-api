const errors = require('@feathersjs/errors');
const fs = require('fs');
const axios = require('axios');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");

const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "id"
  })
];

const storeBlob = function () {
  return function (hook) {
    const blobService = hook.app.service('uploads');
    return blobService.create({uri: hook.data.base64}).then(res => {
      hook.data.blobId = res.id;
      return hook;
    });
  }
};

// create analysis job
const registerAnalysisJob = function () {
  return function (hook) {
    const ipsUrl = hook.app.get("ipsUrl") + '/agenda/api/jobs/create';
    axios.post(ipsUrl, {
        "jobName": "process image",
        "jobSchedule": "now",
        "jobData": {
          "image": {
            "url": `${hook.app.get("siteUrl")}/files/${hook.result.blobId}`
          },
          "webhookUrl": `${hook.app.get("siteUrl")}/cards/analysis/${hook.result.id}`
        }
    }).then(res => {
      console.log("Analysis created successfully");
    }).catch(err => {
      console.log("err", err);
    });
  }
};

const checkTrapId = function(){
  return function(hook){
    hook
      .app.service('traps')
      .get(hook.data.trapId)
      .then(trap =>{
        if (trap) return hook;
        else new errors.BadRequest('Invalid trapId');
      }).catch(err => {
        return err;
      });
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt'), checkTrapId(), storeBlob() ],
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
