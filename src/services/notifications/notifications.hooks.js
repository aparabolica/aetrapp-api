// Logger
const logger = require('winston');

// Moment
const moment = require("moment-timezone");
moment.tz.setDefault("America/Sao_Paulo");

// Feathers
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks');
const { authenticate } = require("@feathersjs/authentication").hooks;
const { iff, isProvider } = require("feathers-hooks-common");

// Helpers
const { scheduleNotification, unscheduleNotification } = require('../../helpers/push-notifications');

const restrict = [
  iff(isProvider('external'), [
    authenticate("jwt"),
    restrictToRoles({
      roles: ['admin'],
      idField: "id",
      ownerField: "senderId",
      owner: true
    })
  ])
];

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [],
    create: [...restrict, associateCurrentUser({ idField: "id", as: "senderId" }), registerPushNotification()],
    remove: [...restrict, cancelPushNotification()]
  }
};


function registerPushNotification() {
  return function (context) {

    // do not schedule notifications when testing
    if (process.env.NODE_ENV == 'test') return context;

    const { recipientId, title, payload, deliveryTime } = context.data;

    // if delivery time exists, always schedule to 8 AM
    if (deliveryTime) {
      context.data.deliveryTime = moment(deliveryTime).hours(8).minutes(0).seconds(0).milliseconds(0);

      // do not set delivery time if event is in the past
      if (context.data.deliveryTime.toDate() < Date.now()) {
        delete context.data.deliveryTime;
      }
    }

    return scheduleNotification(
      recipientId,
      title,
      payload,
      deliveryTime && context.data.deliveryTime
    ).then(oneSignalId => {
      context.data.payload = {
        ...context.data.payload,
        oneSignalId
      };
      return context;
    }).catch(err => {
      logger.error("Error registering notification at OneSignal: "+ err.message);
      return context;
    });
  };
}

function cancelPushNotification() {
  return function (context) {

    // do not unschedule notifications when testing
    if (process.env.NODE_ENV == 'test') return context;

    context.app
      .service("notifications")
      .get(context.id)
      .then(notification => {
        return unscheduleNotification(notification.payload.oneSignalId);
      })
      .catch(err => {
        logger.error("Error canceling notification at OneSignal: " + err.message);
      });
  };
}
