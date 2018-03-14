'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'addressPostcode', 'postcode');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'postcode', 'addressPostcode');
  }
};
