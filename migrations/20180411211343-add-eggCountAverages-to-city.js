'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cities', 'eggCountAverages', Sequelize.DataTypes.JSONB);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cities', 'eggCountAverages');
  }
};
