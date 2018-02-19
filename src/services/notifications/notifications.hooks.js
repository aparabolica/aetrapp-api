const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [
      authenticate("jwt"),
      restrictToRoles({
        roles: ['admin'],
        idField: "id",
        ownerField: "senderId",
        owner: true
      })
    ],
    find: [],
    get: [],
    create: [associateCurrentUser({ idField: "id", as: "senderId" })],
    remove: []
  },

};
