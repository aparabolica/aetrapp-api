'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'active', Sequelize.BOOLEAN );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'active');
  }
};
