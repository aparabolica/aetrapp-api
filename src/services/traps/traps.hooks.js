const { authenticate } = require("feathers-authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const { populate } = require("feathers-hooks-common");

const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "id",
    ownerField: "id"
  })
];

const imageSchema = {
  schema: {
    include: {
      service: "images",
      nameAs: 'image',
      parentField: 'imageId',
      childField: 'id'
    }
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt') ]
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict]
  },

  after: {
    all: [populate(imageSchema)],
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
