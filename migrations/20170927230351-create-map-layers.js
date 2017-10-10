'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('mapLayers', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      // properties
      level: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      filePath: {
        type: Sequelize.STRING
      },

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
    return queryInterface.dropTable('mapLayers');
  }
};
