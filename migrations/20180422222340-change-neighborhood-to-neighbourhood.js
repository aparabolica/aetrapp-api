'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'neighborhood', 'neighbourhood');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', 'neighbourhood', 'neighborhood');
  }
};
