const users = require('./users/users.service.js');
const traps = require('./traps/traps.service.js');
const samples = require('./samples/samples.service.js');
const cities = require('./cities/cities.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(traps);
  app.configure(samples);
  app.configure(cities);
};
