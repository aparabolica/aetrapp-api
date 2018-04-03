const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks');
const { iff, isProvider, getItems } = require("feathers-hooks-common");
const { scheduleNotification } = require('../../helpers/push-notifications');

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
    remove: [...restrict]
  },

};

function registerPushNotification() {
  return function (hook) {
    const { recipientId, title, data, deliveryTime, type } = hook.data;

    switch (type) {
      case "sample-analysis-finished":
        scheduleNotification(
          recipientId,
          {
            deeplink: 'sample/' + data.sampleId,
            message: title
          },
          deliveryTime,
          err => {
            if (err) console.log(err);
          });
        break;

      default:
        break;
    }
  }
}
