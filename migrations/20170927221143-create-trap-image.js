'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('trapImages', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },     

      // properties
      caption: {
        type: Sequelize.TEXT
      },
      filePath: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('trapImages');
  }
};
