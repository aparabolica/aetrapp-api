'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(14),
        primaryKey: true
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salt: {
        type: Sequelize.STRING
      },

      // e-mail
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      // phone numbers
      landlineNumber: {
        type: Sequelize.STRING
      },
      cellphoneNumber: {
        type: Sequelize.STRING
      },

      // personal info
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
      },
      gender: {
        type: Sequelize.STRING
      },

      // location
      coordinates: {
        type: Sequelize.GEOMETRY('POINT', 4326)
      },
      postalcode: {
        type: Sequelize.STRING
      },
      addressStreet: {
        type: Sequelize.STRING
      },
      addressNumber: {
        type: Sequelize.STRING
      },
      addressComplement: {
        type: Sequelize.STRING
      },
      cityId: {
        type: Sequelize.STRING
      },

      // meta
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },

      // timestamp
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      lastSignedInAt: {
        type: Sequelize.DATE,
        allowNull: false
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
