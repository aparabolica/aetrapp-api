'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'eggCountDate', Sequelize.DataTypes.DATE);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'eggCountDate');
  }
};
