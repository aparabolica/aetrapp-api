'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('notifications', 'data', Sequelize.DataTypes.JSONB);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('notifications', 'data', Sequelize.DataTypes.JSON);
  }
};
