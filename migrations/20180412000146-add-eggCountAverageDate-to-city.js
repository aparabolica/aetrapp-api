'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cities', 'eggCountAverageDate', Sequelize.DataTypes.DATE);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cities', 'eggCountAverageDate');
  }
};
