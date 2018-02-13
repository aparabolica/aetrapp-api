const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  restrictToOwner,
  associateCurrentUser
} = require("feathers-authentication-hooks");
const { populate } = require("feathers-hooks-common");
const parseDateQuery = require("../../hooks/parse-date-query");


const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "ownerId"
  })
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
        service: "samples",
        nameAs: "eggCountSeries",
        parentField: "id",
        childField: "trapId",
        query: {
          processed: true,
          error: null,
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
      .catch(err => {
        return new errors.GeneralError("Internal error.");
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
      associateCurrentUser({ idField: "id", as: "ownerId" })
    ],
    update: [...restrict],
    patch: [
      ...restrict,
      iff(
        hook => { return hook.data && hook.data.isActive },
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
