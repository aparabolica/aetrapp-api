'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('notifications', 'data', 'payload');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('notifications', 'payload', 'data');
  }
};
