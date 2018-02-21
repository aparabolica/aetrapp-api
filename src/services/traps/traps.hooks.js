const { authenticate } = require("@feathersjs/authentication").hooks;
const { associateCurrentUser } = require("feathers-authentication-hooks");
const { iff, isProvider, populate } = require("feathers-hooks-common");
const parseDateQuery = require("../../hooks/parse-date-query");
const errors = require("@feathersjs/errors");

const loadTrap = function () {
  return function (hook) {
    return hook.app
      .service("traps")
      .get(hook.id)
      .then(trap => {
        if (trap) {
          hook.trap = trap;
          return hook;
        }
        else new errors.BadRequest("Could not find trap.");
      })
      .catch(err => {
        return new errors.GeneralError("Internal error.");
      });
  };
};


const restrict = [
  iff(isProvider('external'), [
    authenticate("jwt"),
    loadTrap(),
    function (hook) {
      const { trap } = hook;
      const { id, roles } = hook.params.user;

      // user is the owner?
      if (trap.ownerId == id) return hook;

      // user is admin?
      if (roles.includes['admin']) return hook;

      // user is a city moderator?
      if (!roles.includes['moderator']) throw new errors.Forbidden("User is not allowed to change this trap.");
      else
        return hook.app.get("sequelizeClient")
          .users
          .findById(id)
          .then(function (user) {
            return user.hasCity(trap.addressCityId).then(result => {
              if (result)
                return hook;
              else
                throw new errors.Forbidden("User is not allowed to change this trap.");
            });
          })
    }
  ])
];

const sampleSchema = {
  schema: {
    include: [
      {
        service: "samples",
        parentField: "id",
        childField: "trapId",
        asArray: true,
        query: {
          $select: ["id"],
          $sort: { collectedAt: -1 }
        }
      },
      {
        service: "cities",
        nameAs: "city",
        parentField: "addressCityId",
        childField: "id"
      },
      {
        service: "samples",
        nameAs: "eggCountSeries",
        parentField: "id",
        childField: "trapId",
        query: {
          status: "valid",
          $select: ["id", "eggCount", "collectedAt"],
          $sort: { collectedAt: 1 }
        },
        asArray: true
      }
    ]
  }
};

const deactivateActiveTrap = function () {
  return function (hook) {
    return hook.app
      .service("traps")
      .patch(null, { isActive: false }, {
        query: {
          ownerId: hook.params.user.id,
          isActive: true
        }
      })
      .then(res => {
        return hook;
      })
      .catch(err => {
        return new errors.GeneralError("Internal error.");
      });
  };
};

const storeBlob = function () {
  return function (hook) {
    const blobService = hook.app.service("uploads");
    return blobService.create({ uri: hook.data.base64 }).then(res => {
      hook.data.imageId = res.id;
      return hook;
    });
  };
};

module.exports = {
  before: {
    all: [],
    find: [
      parseDateQuery("createdAt"),
      parseDateQuery("updatedAt")
    ],
    get: [],
    create: [
      authenticate("jwt"),
      associateCurrentUser({ idField: "id", as: "ownerId" }),
      storeBlob()
    ],
    update: [...restrict],
    patch: [
      ...restrict,
      iff(
        hook => {
          return hook.data && hook.data.isActive
        },
        deactivateActiveTrap()
      )
    ],
    remove: [...restrict]
  },

  after: {
    all: [populate(sampleSchema)],
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
