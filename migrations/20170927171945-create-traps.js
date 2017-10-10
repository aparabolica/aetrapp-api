'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('traps', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      // properties
      statusCode: {
        type: Sequelize.INTEGER
      },
      statusMessage: {
        type: Sequelize.TEXT
      },
      daysToCollect: Sequelize.INTEGER,
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
      addressStreet: {
        type: Sequelize.STRING
      },
      addressNumber: {
        type: Sequelize.STRING
      },
      addressComplement: {
        type: Sequelize.STRING
      },
      addressNeighborhood: {
        type: Sequelize.STRING
      },
      addressPostcode: {
        type: Sequelize.STRING
      },
      addressCityId: {
        type: Sequelize.STRING
      },
      addressStateId: {
        type: Sequelize.STRING
      },

      // relations
      ownerId: {
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
