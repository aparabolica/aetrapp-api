const users = require('./users/users.service.js');
const traps = require('./traps/traps.service.js');
const cards = require('./cards/cards.service.js');
const cities = require('./cities/cities.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(traps);
  app.configure(cards);
  app.configure(cities);
};
