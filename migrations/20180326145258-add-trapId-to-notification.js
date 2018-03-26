'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('notifications', 'trapId', Sequelize.DataTypes.STRING);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('notifications', 'trapId');
  }
};
