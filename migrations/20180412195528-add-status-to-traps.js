'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'status', Sequelize.DataTypes.STRING);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'status');
  }
};
