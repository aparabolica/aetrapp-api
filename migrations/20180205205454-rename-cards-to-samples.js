'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('cards', 'samples');
  },
  down: (queryInterface) => {
    return queryInterface.renameTable('samples', 'cards');
  }
};
