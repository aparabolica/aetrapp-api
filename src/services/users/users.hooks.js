const { authenticate } = require("feathers-authentication").hooks;
var common = require("feathers-hooks-common");
var {
  discard,
  pluckQuery,
  keep,
  when
} = common;

const { restrictToOwner } = require("feathers-authentication-hooks");
const { hashPassword } = require("feathers-authentication-local").hooks;
const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "id"
  })
];

const { findByEmail } = require("../../validations");

module.exports = {
  before: {
    all: [],
    find: [pluckQuery("email"), findByEmail],
    get: [...restrict],
    create: [hashPassword()],
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
