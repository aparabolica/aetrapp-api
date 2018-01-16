'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cards', 'jobId', Sequelize.STRING );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('cards', 'jobId');
  }
};
