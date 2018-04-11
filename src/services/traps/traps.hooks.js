const _ = require("lodash");
const async = require("async");

// Localized moment.js
const moment = require("moment/min/moment-with-locales");
moment.locale("pt-br");

// Helpers
const parseDateQuery = require("../../hooks/parse-date-query");

// Feathers & Sequelize
const Sequelize = require('sequelize');
const { associateCurrentUser } = require("feathers-authentication-hooks");
const { fastJoin, getItems, iff, isProvider, replaceItems } = require("feathers-hooks-common");
const { authenticate } = require("@feathersjs/authentication").hooks;
const errors = require("@feathersjs/errors");
const dehydrate = require('feathers-sequelize/hooks/dehydrate');

// Helper hooks
const { doResolver } = require('../../hooks');


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

const removeFutureNotifications = function () {
  return function (hook) {
    const trap = _.castArray(getItems(hook))[0];

    // Remove future notifications associated with this trap
    hook.app
      .service("notifications")
      .find({
        query: {
          payload: {
            trapId: trap.id
          },
          deliveryTime: {
            [Sequelize.Op.gt]: new Date()
          }
        },
        paginate: false
      })
      .then(results => {
        async.eachSeries(results, (item, doneItem) => {
          hook.app
            .service("notifications")
            .remove(item.id)
            .then(() => {
              doneItem();
            })
            .catch(err => {
              console.log(`Could not remove notif. ${item.id} due to error: ` + err.message);
              doneItem();
            });
        }, (err, results) => {
          if (err) console.log("Error removing future notifications", err);
        });
      })
      .catch(err => {
        console.log('Error removing notifications');
        console.log(err);
      });
  }
}

const addNotifications = function () {
  return function (hook) {
    const trap = _.castArray(getItems(hook))[0];
    trap.windowStart = moment(trap.cycleStart).add(trap.cycleDuration - 1, 'days');

    // sample window is near notification
    const sampleAlmostReadyAt = moment(trap.cycleStart).add(trap.cycleDuration - 2, 'days').toDate();
    hook.app
      .service("notifications")
      .create({
        recipientId: trap.ownerId,
        payload: {
          type: 'trap-almost-ready',
          deeplink: 'trap/' + trap.id,
          trapId: trap.id
        },
        title: "Amanhã é dia de fotografar amostra!",
        deliveryTime: sampleAlmostReadyAt,
        message: "Não se esqueça, amanhã você deve fotografar a amostra de sua armadilha no endereço " + trap.addressStreet + "."
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });

    // sample window is ready notification
    hook.app
      .service("notifications")
      .create({
        recipientId: trap.ownerId,
        payload: {
          type: 'trap-is-ready',
          deeplink: 'trap/' + trap.id,
          trapId: trap.id
        },
        title: "Hoje é dia de fotografar amostra!",
        deliveryTime: moment(trap.windowStart).toDate(),
        message: "Não se esqueça, hoje é dia de fotografar a amostra, trocar a paleta e higienizar sua armadilha no endereço " + trap.addressStreet + "."
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });

    // sample window has finished
    for (let i = 0; i < 7; i++) {
      hook.app
      .service("notifications")
      .create({
        recipientId: trap.ownerId,
        payload: {
          type: 'trap-must-be-discarded',
          deeplink: 'trap/' + trap.id,
          trapId: trap.id
        },
        title: "A armadilha está vencida, desative-a ou inicie novo ciclo!",
        deliveryTime: moment(trap.cycleStart).add(trap.cycleDuration + i, 'days'),
        message: `Você não realizou a manutenção semanal de sua armadilha no endereço ${trap.addressStreet}. Envie hoje a fotografia da amostra. Se quiser interromper temporariamente o monitoramento, desative sua armadilha no aplicativo e guarde ou descarte corretamente o material. Para voltar a monitorar no futuro, basta reativá-la no app. Não deixe sua armadilha se transformar em um criadouro!`
      })
      .catch(err => {
        console.log('Error creating notification');
        console.log(err);
      });
    }
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
 * Includes resolver
 */

const trapResolver = {
  joins: {
    owner: (...args) => async (trap, context) => {
      const users = context.app.services['users'];
      trap.owner = await users.get(trap.ownerId, {
        skipResolver: true,
        query: {
          $select: ['id', 'firstName', 'lastName']
        }
      });
    },
    lastSampleAndCount: $select => async (trap, context) => {
      const samples = context.app.services['samples'];
      const queryResult = await samples.find({
        skipResolver: true,
        query: {
          trapId: trap.id,
          $select: ['id', 'eggCount', 'collectedAt', 'status'],
          $sort: { collectedAt: -1 },
          $limit: 1
        }
      });
      trap.lastSample = queryResult.data[0];
      trap.sampleCount = queryResult.total;
    },
    city: () => async (trap, context) => {
      const cities = context.app.services['cities'];
      trap.city = await cities.get(trap.cityId, {
        skipResolver: true
      })
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
    patch: [...restrict],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [dehydrate(), addDelayedStatus(), fastJoin(includeSamplesResolver)],
    get: [dehydrate(), addDelayedStatus(), fastJoin(includeSamplesResolver)],
    create: [addNotifications()],
    update: [],
    patch: [
      iff(hook => { return hook.data && hook.data.isActive == false }, removeFutureNotifications()),
      iff(hook => { return hook.data && (hook.data.cycleStart || hook.data.isActive) }, [removeFutureNotifications(), addNotifications()])
    ],
    remove: [removeFutureNotifications()]
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
