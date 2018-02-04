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

const cardSchema = {
  schema: {
    include: [
      {
        service: "cards",
        parentField: "id",
        childField: "trapId",
        asArray: true,
        query: {
          $select: ["id"],
          $sort: { collectedAt: -1 }
        }
      },
      {
        service: "cards",
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
    patch: [...restrict],
    remove: [...restrict]
  },

  after: {
    all: [populate(cardSchema)],
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
