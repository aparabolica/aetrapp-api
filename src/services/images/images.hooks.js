const fs = require('fs');
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
    create: [],
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
