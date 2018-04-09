// Moment
const moment = require("moment-timezone");
moment.tz.setDefault("America/Sao_Paulo");

// Feathers
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks');
const { authenticate } = require("@feathersjs/authentication").hooks;
const errors = require("@feathersjs/errors");
const { iff, isProvider, getItems } = require("feathers-hooks-common");

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
]

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
  return function (hook) {
    const { recipientId, title, payload, deliveryTime, type } = hook.data;

    // if delivery time exists, always schedule to 8 AM
    if (deliveryTime) {
      hook.data.deliveryTime = moment(deliveryTime).hours(8).minutes(0).seconds(0).milliseconds(0);

      // do not set delivery time if event is in the past
      if (hook.data.deliveryTime.toDate() < Date.now()) {
        delete hook.data.deliveryTime;
      }
    }

    return scheduleNotification(
      recipientId,
      title,
      payload,
      deliveryTime && hook.data.deliveryTime
    ).then(oneSignalId => {
        hook.data.payload = {
          ...hook.data.payload,
          oneSignalId
        }
        return hook;
      }).catch(err => {
        console.log("Error registering notification at OneSignal: "+ err.message);
        return hook;
      });
  }
}

function cancelPushNotification() {
  return function (hook) {

    hook.app
      .service("notifications")
      .get(hook.id)
      .then(notification => {
        return unscheduleNotification(notification.payload.oneSignalId);
      })
      .catch(err => {
        console.log("Error canceling notification at OneSignal: " + err.message);
      });
    }
}
