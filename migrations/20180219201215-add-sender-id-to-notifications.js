'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('notifications', 'senderId', Sequelize.DataTypes.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('notifications', 'senderId');
  }
};
