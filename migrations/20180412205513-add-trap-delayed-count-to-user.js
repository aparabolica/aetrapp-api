'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'delayedTrapCount', Sequelize.DataTypes.INTEGER);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'delayedTrapCount');
  }
};
