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
const { disallow, getItems, iff, isProvider } = require("feathers-hooks-common");
const { authenticate } = require("@feathersjs/authentication").hooks;
const errors = require("@feathersjs/errors");

// Helper hooks
const { doResolver, } = require('../../hooks');
const {
  updateUserTrapCount,
  setActiveTrapStatus,
  parseSortByCity,
  setCycleDates
} = require('../../hooks/traps');


/*
 * Authentication
 */

const restrict = [
  iff(isProvider('external'), [
    authenticate("jwt"),
    async function (context) {
      const { id, roles } = context.params.user;

      // load trap if not available
      let { trap } = context;
      if (!trap) {
        const traps = context.app.service("traps");
        trap = await traps.get(context.id, {
          skipResolver: true
        });
      }

      // user is the owner?
      if (trap.ownerId == id) return context;

      // user is admin?
      if (roles.includes('admin')) return context;

      // user is a city moderator?
      if (!roles.includes('moderator')) throw new errors.Forbidden("User is not allowed to change this trap.");
      else
        return context.app.get("sequelizeClient")
          .users
          .findById(id)
          .then(function (user) {
            return user.hasCity(trap.cityId).then(result => {
              if (result)
                return context;
              else
                throw new errors.Forbidden("User is not allowed to change this trap.");
            });
          });
    }
  ])
];

/*
 * Blob
 */

const storeBlob = function () {
  return function (context) {
    const { data } = context;

    if (!data || !data.base64)
      throw new errors.BadRequest("Missing trap image.");

    const blobService = context.app.service("uploads");
    return blobService.create({ uri: context.data.base64 }).then(res => {
      context.data.imageId = res.id;
      return context;
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
  };
};

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
  };
};

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
      });
    }
  }
};

/*
 * The hooks
 */

module.exports = {
  before: {
    all: [],
    find: [
      parseSortByCity(),
      parseDateQuery("createdAt"),
      parseDateQuery("updatedAt")
    ],
    get: [],
    create: [
      authenticate("jwt"),
      associateCurrentUser({ idField: "id", as: "ownerId" }),
      storeBlob()
    ],
    update: [disallow()],
    patch: [
      ...restrict,
      iff(isProvider('external'),
        iff(
          hook => { return hook.data && hook.data.status == 'active'; },
          setCycleDates(),
        )
      ),
      setActiveTrapStatus()
    ],
    remove: [...restrict]
  },

  after: {
    all: [],
    find: [
      doResolver(trapResolver)
    ],
    get: [doResolver(trapResolver)],
    create: [
      addNotifications(),
      updateUserTrapCount()
    ],
    update: [],
    patch: [
      async context => {
        // Update city if eggCount is passed
        if (context.data && (typeof context.data.eggCount !== "undefined")) {
          const traps = context.app.service("traps");
          const cities = context.app.service("cities");

          // load trap if not available
          let { trap } = context;
          if (!trap) {
            const traps = context.app.service("traps");
            trap = await traps.get(context.id, {
              skipResolver: true
            });
          }

          // trigger city update
          cities.patch(trap.cityId, { eggCountAverage: true });
        }
      },
      iff(isProvider('external'),
        iff(hook => { return hook.data && hook.data.status == 'inactive'; },
          removeFutureNotifications()
        ).else(
          removeFutureNotifications(),
          addNotifications()
        )
      ),
      updateUserTrapCount()
    ],
    remove: [removeFutureNotifications(), updateUserTrapCount()]
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
