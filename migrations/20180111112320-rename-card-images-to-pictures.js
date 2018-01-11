'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameTable('cardImages', 'cards');
  },

  down: (queryInterface) => {
    return queryInterface.renameTable('cards', 'cardImages');
  }
};
