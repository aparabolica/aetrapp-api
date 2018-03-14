'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'addressNeighborhood', 'neighborhood');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'neighborhood', 'addressNeighborhood');
  }
};
