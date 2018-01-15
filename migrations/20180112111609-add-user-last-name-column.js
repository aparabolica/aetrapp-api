'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'lastName', Sequelize.STRING );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'lastName');
  }
};
