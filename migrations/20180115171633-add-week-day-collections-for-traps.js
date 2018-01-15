'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traps', 'collectionWeekday', Sequelize.INTEGER );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('traps', 'collectionWeekday');
  }
};
