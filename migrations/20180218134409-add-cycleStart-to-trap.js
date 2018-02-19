'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'cycleStart', Sequelize.DataTypes.DATE)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'cycleStart')
  }
};
