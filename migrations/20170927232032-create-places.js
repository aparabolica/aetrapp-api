'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('places', {
      // IBGE id for places in Brazil
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      // properties
      name: {
        type: Sequelize.STRING
      },
      adminLevel: {
        type: Sequelize.STRING,
      },
      boudingBox: {
        type: Sequelize.ARRAY(Sequelize.GEOMETRY('POINT', 4326)),
      },
      coordinates: {
        type: Sequelize.GEOMETRY('POINT', 4326)
      },

      // relation
      parendId: Sequelize.STRING,

      // timestamps
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      udpatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('places');
  }
};
