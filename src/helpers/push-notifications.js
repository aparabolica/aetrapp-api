// Config
const config = require("config");
const { API_KEY, APP_ID } = config.get("oneSignal");

// HTTP Agent
const request = require('superagent');
const defaultHeaders = {
  authorization: 'Basic ' + API_KEY,
  'cache-control': 'no-cache',
  'content-type': 'application/json; charset=utf-8'
}

module.exports = {
  scheduleNotification: function (userId, message, payload, send_after) {
    return request
      .post("https://onesignal.com/api/v1/notifications")
      .set(defaultHeaders)
      .send({
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
          en: message
        },
        data: payload
      })
      .then(res=>{
        return res.body.id;
      });
  },
  unscheduleNotification: function(notificationId){
    return request
      .delete(`https://onesignal.com/api/v1/notifications/${notificationId}`)
      .set(defaultHeaders)
      .send({
        app_id: APP_ID,
      });
  }
}
