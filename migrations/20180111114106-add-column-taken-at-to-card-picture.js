'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cards', 'collectedAt', Sequelize.DATE );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cards', 'collectedAt');
  }
};
