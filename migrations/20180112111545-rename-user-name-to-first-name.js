'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameColumn('users', 'name', 'firstName');
  },

  down: (queryInterface) => {
    return queryInterface.renameColumn('users', 'firstName', 'name');
  }
};
