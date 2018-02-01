'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var cities = require("../collections/cities.json");
    return queryInterface.bulkInsert('cities', cities, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cities', null, {});
  }
};
