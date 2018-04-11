'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cities', 'eggCountAverage', Sequelize.DataTypes.INTEGER);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cities', 'eggCountAverage');
  }
};
