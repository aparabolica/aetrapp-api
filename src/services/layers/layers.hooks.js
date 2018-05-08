const _ = require("lodash");

// auth
const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles } = require("feathers-authentication-hooks");
const simplifyGeojson = require("simplify-geojson");

/*
 * Authentication
 */

const restrict = [
  authenticate("jwt"),
  restrictToRoles({
    roles: ["admin"],
    idField: "id"
  })
];

const simplify = () => hook => {
  if (hook.data.geojson) {
    hook.data.geojson = simplifyGeojson(hook.data.geojson, 0.01);
  }
  return hook;
};

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
      simplify(),
      context => {
        const { geojson } = context.data;

        if (geojson && geojson.features) {
          let properties = [];

          geojson.features.forEach(feature => {
            properties =
              feature.properties &&
              _.union(properties, _.keys(feature.properties));
          });

          context.data.properties = properties;
        }
      }
    ],
    patch: [...restrict, simplify()],
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
