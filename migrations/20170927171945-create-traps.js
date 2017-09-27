'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('traps', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING(7),
        primaryKey: true
      },     

      // properties
      statusCode: {
        type: Sequelize.INTEGER
      },
      statusMessage: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT,
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

      // timestamps
      createdAt: {
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
    return queryInterface.dropTable('traps');
  }
};
