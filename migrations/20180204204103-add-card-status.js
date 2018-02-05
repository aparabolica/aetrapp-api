'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cards', 'status', Sequelize.STRING );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('cards', 'status');
  }
};
