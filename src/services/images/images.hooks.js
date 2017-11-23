const fs = require('fs');
const { authenticate } = require("feathers-authentication").hooks;

const common = require("feathers-hooks-common");
const {
  discard,
  pluckQuery,
  keep,
  when
} = common;

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
    console.log(hook.data);
    return blobService.create(hook.data.base64).then(res => {
      hook.data.blobId = res.id;
      return hook;
    });
  }
};

const { findByEmail } = require("../../validations");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt'), storeBlob() ],
    update: [...restrict, hashPassword()],
    patch: [...restrict, hashPassword()],
    remove: [...restrict]
  },

  after: {
    all: [when(hook => hook.params.provider, discard("password"))],
    find: [keep("email")],
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
