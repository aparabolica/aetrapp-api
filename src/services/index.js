const cities = require('./cities/cities.service.js');
const notifications = require('./notifications/notifications.service.js');
const samples = require('./samples/samples.service.js');
const traps = require('./traps/traps.service.js');
const users = require('./users/users.service.js');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(cities);
  app.configure(notifications);
  app.configure(samples);
  app.configure(traps);
  app.configure(users);
};
