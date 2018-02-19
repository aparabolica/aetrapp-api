const { authenticate } = require('@feathersjs/authentication').hooks;
var common = require("feathers-hooks-common");
var {
  discard,
  pluckQuery,
  iff,
  isProvider,
  keep,
  when
} = common;

const { restrictToRoles } = require("feathers-authentication-hooks");
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const restrict = [
  authenticate("jwt"),
  restrictToRoles({
    roles: ['admin'],
    idField: "id",
    ownerField: "id",
    owner: true
  })
];

const { findByEmail } = require("../../validations");

module.exports = {
  before: {
    all: [],
    find: [iff(!isProvider("server"),[pluckQuery("email"), findByEmail])],
    get: [...restrict],
    create: [hashPassword()],
    update: [...restrict, hashPassword()],
    patch: [...restrict, hashPassword()],
    remove: [...restrict]
  },

  after: {
    all: [when(hook => hook.params.provider, discard("password"))],
    find: [iff(!isProvider("server"),keep("email"))],
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
