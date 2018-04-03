const request = require('request');

// Config
const config = require("config");
const { API_KEY, APP_ID } = config.get("oneSignal");
let baseRequest = request.defaults({
  headers: {
    authorization: 'Basic ' + API_KEY,
    'cache-control': 'no-cache',
    'content-type': 'application/json; charset=utf-8'
  }
});

module.exports = {
  scheduleNotification: function (userId, payload, send_after, donescheduleNotification) {
    baseRequest({
      method: 'POST',
      url: 'https://onesignal.com/api/v1/notifications',
      body: JSON.stringify({
        app_id: APP_ID,
        send_after,
        filters: [
          {
            "field": "tag",
            "key": "userId",
            "relation": "=",
            "value": userId
          },
        ],
        headings: {
          en: "Aetrapp"
        },
        contents: {
          en: payload.message
        },
        data: {
          deeplink: payload.deeplink
        }
      })
    }, (err, res, body) => {
      if (err) console.log('error creating notification', err);
    });
  }

}

