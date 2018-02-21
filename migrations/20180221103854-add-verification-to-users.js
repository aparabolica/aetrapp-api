'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('users', 'emailIsVerified'),
      queryInterface.addColumn('users', 'isVerified', Sequelize.DataTypes.BOOLEAN),
      queryInterface.addColumn('users', 'verifyToken', Sequelize.DataTypes.STRING),
      queryInterface.addColumn('users', 'verifyExpires', Sequelize.DataTypes.DATE),
      queryInterface.addColumn('users', 'verifyChanges', Sequelize.DataTypes.JSON),
      queryInterface.addColumn('users', 'resetToken', Sequelize.DataTypes.STRING),
      queryInterface.addColumn('users', 'resetExpires', Sequelize.DataTypes.DATE),
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('users', 'emailIsVerified', Sequelize.DataTypes.BOOLEAN),
      queryInterface.removeColumn('users', 'isVerified'),
      queryInterface.removeColumn('users', 'verifyToken'),
      queryInterface.removeColumn('users', 'verifyExpires'),
      queryInterface.removeColumn('users', 'verifyChanges'),
      queryInterface.removeColumn('users', 'resetToken'),
      queryInterface.removeColumn('users', 'resetExpires'),
    ]
  }
};
