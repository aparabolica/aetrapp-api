'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'addressCityId', 'cityId');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'cityId', 'addressCityId');
  }
};
