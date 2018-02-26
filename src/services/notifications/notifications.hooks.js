const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks');
const { iff, isProvider } = require("feathers-hooks-common");

const restrict = [
  iff(isProvider('external'), [
    authenticate("jwt"),
    restrictToRoles({
      roles: ['admin'],
      idField: "id",
      ownerField: "senderId",
      owner: true
    })
  ])
]

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [],
    create: [...restrict, associateCurrentUser({ idField: "id", as: "senderId" })],
    remove: [...restrict]
  },

};
