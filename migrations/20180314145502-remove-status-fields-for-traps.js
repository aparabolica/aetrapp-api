'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('traps', 'statusCode'),
      queryInterface.removeColumn('traps', 'statusMessage'),
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('traps', 'statusCode', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('traps', 'statusMessage', Sequelize.DataTypes.STRING),
    ]
  }
};
