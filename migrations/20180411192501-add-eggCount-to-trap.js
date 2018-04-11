'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'eggCount', Sequelize.DataTypes.INTEGER);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'eggCount');
  }
};
