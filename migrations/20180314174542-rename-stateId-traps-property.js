'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('traps', "addressStateId", "stateId");
  },

  down: (queryInterface, Sequelize) => {
    return  queryInterface.renameColumn('traps', 'stateId', 'addressStateId');
  }
};
