'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'isActive', Sequelize.BOOLEAN );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'isActive');
  }
};
