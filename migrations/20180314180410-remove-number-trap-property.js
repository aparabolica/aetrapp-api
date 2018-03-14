'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'addressNumber');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'addressNumber', Sequelize.DataTypes.STRING)
  }
};
