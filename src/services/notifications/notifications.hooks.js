const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [
      authenticate("jwt"),
      restrictToRoles({
        roles: ['admin'],
        owner: false
      })
    ],
    find: [],
    get: [],
    create: [],
    remove: []
  },

};
