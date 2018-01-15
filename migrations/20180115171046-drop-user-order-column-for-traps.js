'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('traps', 'userOrder');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'userOrder', Sequelize.INTEGER );
  }
};
