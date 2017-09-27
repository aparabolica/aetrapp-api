'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // personal info
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
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

      // contact
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      landlineNumber: {
        type: Sequelize.STRING
      },
      cellphoneNumber: {
        type: Sequelize.STRING
      },

      // meta
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }, {
      timestamps: true
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
