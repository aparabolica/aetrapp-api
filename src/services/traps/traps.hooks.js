const _ = require("lodash");
const { authenticate } = require("@feathersjs/authentication").hooks;
const { associateCurrentUser } = require("feathers-authentication-hooks");
const { fastJoin, getItems, iff, isProvider, replaceItems } = require("feathers-hooks-common");
const parseDateQuery = require("../../hooks/parse-date-query");
const errors = require("@feathersjs/errors");
const dehydrate = require('feathers-sequelize/hooks/dehydrate');

// Localized moment.js
const moment = require("moment/min/moment-with-locales");
moment.locale("pt-br");

/*
 * Authentication
 */

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
            return user.hasCity(trap.cityId).then(result => {
              if (result)
                return hook;
              else
                throw new errors.Forbidden("User is not allowed to change this trap.");
            });
          })
    }
  ])
];

/*
 * Blob
 */

const storeBlob = function () {
  return function (hook) {
    const blobService = hook.app.service("uploads");
    return blobService.create({ uri: hook.data.base64 }).then(res => {
      hook.data.imageId = res.id;
      return hook;
    });
  };
};

/*
 * Notification
 */

const notifyCollectWindow = function () {
  return function (hook) {
    const trap = _.castArray(getItems(hook))[0];
    trap.windowStart = moment(trap.cycleStart).add(trap.cycleDuration - 1, 'days');

    // trap was created notification
    hook.app
      .service("notifications")
      .create({
        recipientId: trap.ownerId,
        type: 'direct',
        title: "Armadilha criada",
        message: "Você deverá remover o cartão no endereço " + trap.addressStreet + " em "
          + moment(trap.cycleStart).add(trap.cycleDuration - 1, 'days').fromNow()
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });

    // sample window is near notification
    hook.app
      .service("notifications")
      .create({
        recipientId: trap.ownerId,
        type: 'direct',
        data: { trapId: trap.id },
        title: "Coleta amanhã",
        deliveryTime: moment(trap.cycleStart).add(trap.cycleDuration - 2, 'days').toDate(),
        message: "A coleta da amostra deverá ser feita amanhã"
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });

    // sample window is near notification
    hook.app
      .service("notifications")
      .create({
        recipientId: trap.ownerId,
        type: 'direct',
        data: { trapId: trap.id },
        title: "Coleta hoje:",
        deliveryTime: moment(trap.cycleStart).add(10, 'days').toDate(),
        message: "Retire o cartão de amostra da armadilha"
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });
  }
}

/*
 * Parse sort by city
 */

const sortByCity = function () {
  return function (hook) {
    const { query } = hook.params;
    const City = hook.app.services.cities.Model;
    const sortOrder = parseInt(query.$sort['city']) == -1 ? 'DESC' : 'ASC';

    hook.params.sequelize = {
      raw: false,
      include: [{ model: City, attributes: ['id', 'stateId', 'name'] }],
      order: [[City, 'stateId', sortOrder], [City, 'name', sortOrder]]
    }

    delete query.$sort['city'];
    return hook;
  }
}

const parseSortByCity = [
  iff(hook => {
    const { query } = hook.params;
    return query && query.$sort && query.$sort['city'];
  }, sortByCity()),
];

/*
 * Include samples resolver
 */

const includeSamplesResolver = {
  joins: {
    samples: $select => async (trap, context) => {
      const samples = context.app.services['samples'];
      trap.samples = await samples.find({
        query: {
          trapId: trap.id,
          $select: ['id', 'eggCount', 'collectedAt', 'status'],
          $sort: { collectedAt: -1 },
        },
        paginate: false
      });
    }
  }
};

/*
 * addDelayedStatus
 */

function addDelayedStatus() {
  function setDelayedStatus(trap) {
    trap.windowStart = moment(trap.cycleStart).add(trap.cycleDuration - 1, 'days').toDate();
    const now = new Date();
    if (trap.isActive && trap.windowStart.getTime() < now.getTime()) {
      trap.isDelayed = true;
    } else {
      trap.isDelayed = false;
    }
    return trap;
  }

  return function (hook) {
    let traps = getItems(hook);
    if (!Array.isArray(traps)) {
      traps = setDelayedStatus(traps);
    } else {
      traps = traps.map(trap => {
        return setDelayedStatus(trap);
      });
    }
    replaceItems(hook, traps);
    return hook;
  }
}

/*
 * The hooks
 */

module.exports = {
  before: {
    all: [],
    find: [
      ...parseSortByCity,
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
        }
      )
    ],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [dehydrate(), addDelayedStatus(), fastJoin(includeSamplesResolver)],
    get: [dehydrate(), addDelayedStatus(), fastJoin(includeSamplesResolver)],
    create: [notifyCollectWindow()],
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
