const errors = require("@feathersjs/errors");
const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks');
const { iff, isProvider, getItems } = require("feathers-hooks-common");
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
    const { recipientId, title, data, deliveryTime, type } = hook.data;
    return scheduleNotification(
      recipientId,
      {
        data,
        message: title
      },
      deliveryTime
    ).then(oneSignalId => {
        hook.data.data = {
          ...hook.data.data,
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
        return unscheduleNotification(notification.data.oneSignalId);
      })
      .catch(err => {
        console.log("Error canceling notification at OneSignal: " + err.message);
      });
    }
}
