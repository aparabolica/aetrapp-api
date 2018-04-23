const authManagement = require('./auth-management/auth-management.service.js');
const cities = require('./cities/cities.service.js');
const downloads = require('./downloads/downloads.service.js');
const emails = require('./emails/emails.service.js');
const layers = require('./layers/layers.service.js');
const notifications = require('./notifications/notifications.service.js');
const samples = require('./samples/samples.service.js');
const traps = require('./traps/traps.service.js');
const users = require('./users/users.service.js');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(authManagement);
  app.configure(cities);
  app.configure(downloads);
  app.configure(emails);
  app.configure(layers);
  app.configure(notifications);
  app.configure(samples);
  app.configure(traps);
  app.configure(users);
};
