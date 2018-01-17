'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cards', 'ownerId', Sequelize.STRING );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('cards', 'ownerId');
  }
};
