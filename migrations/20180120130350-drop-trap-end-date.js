'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traps', 'endDate' );
  },
  down: (queryInterface) => {
    return queryInterface.addColumn('traps', 'endDate', Sequelize.DATE);
  }
};
