'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'startDate' );
  },
  down: (queryInterface) => {
    return queryInterface.addColumn('traps', 'startDate', Sequelize.DATE);
  }
};
