'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'trapCount', Sequelize.DataTypes.INTEGER);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'trapCount');
  }
};
