const _ = require("lodash");

// auth
const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles } = require("feathers-authentication-hooks");

/*
 * Authentication
 */

const restrict = [
  authenticate("jwt"),
  restrictToRoles({
    roles: ['admin'],
    idField: "id"
  })
];

/*
 * The hooks
 */

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      ...restrict,
      context => {
        const { geojson } = context.data;

        if (geojson && geojson.features) {
          let properties = [];

          geojson.features.forEach(feature => {
            properties = feature.properties && _.union(properties, _.keys(feature.properties));
          })

          context.data.properties = properties;
        }
      }],
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
