'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('citiesMaintainers');
  }
};
