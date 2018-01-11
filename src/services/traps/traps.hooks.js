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

const cardSchema = {
  schema: {
    include: {
      service: "cards",
      nameAs: 'card',
      parentField: 'cardId',
      childField: 'id'
    }
  }
}

const setOwnerId = function(){
  return function(hook){
    hook.data.ownerId = hook.params.user.id;
    return hook;
  }
}

const setUserOrder = function(){
  return function(hook){
    const {ownerId} = hook.data;
    return hook.app.service('traps').find({
      query: {
        ownerId,
        '$sort': {
          'createdAt': -1
        },
        '$limit': 1
      }
    }).then(traps => {
      if (traps.data.length)
        hook.data.userOrder = traps.data[0].userOrder + 1;
      else
        hook.data.userOrder = 1;
      return hook;
    }).catch(err => {
      console.log(err);
      hook.data.userOrder = 1;
    })
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt'), setOwnerId(), setUserOrder() ],
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
