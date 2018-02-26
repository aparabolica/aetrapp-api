'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('notifications', 'recipientId', Sequelize.DataTypes.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('notifications', 'recipientId');
  }
};
