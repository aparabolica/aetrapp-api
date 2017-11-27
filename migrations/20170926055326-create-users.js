'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const DataTypes = Sequelize.DataTypes;
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // e-mail
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      emailIsVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      // phone numbers
      landlineNumber: {
        type: DataTypes.STRING
      },
      cellphoneNumber: {
        type: DataTypes.STRING
      },

      // personal info
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY
      },
      gender: {
        type: DataTypes.STRING
      },

      // meta
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      isActive: {
        type: DataTypes.BOOLEAN
      },

      // timestamp
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      lastSignedInAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
