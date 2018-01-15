const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const { populate } = require("feathers-hooks-common");

const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "id"
  })
];

const cardSchema = {
  schema: {
    include: [{
      service: "cards",
      nameAs: "allCards",
      parentField: "id",
      childField: "trapId",
      asArray: true
    }, {
      service: "cards",
      nameAs: "eggCountSeries",
      parentField: "id",
      childField: "trapId",
      query: {
        processed: true,
        error: null,
        $select: ["id", "eggCount", "collectedAt"],
        $sort: {createdAt: 1}
      },
      asArray: true
    }]
  }
};

const setOwnerId = function() {
  return function(hook) {
    hook.data.ownerId = hook.params.user.id;
    return hook;
  };
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate("jwt"), setOwnerId()],
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
