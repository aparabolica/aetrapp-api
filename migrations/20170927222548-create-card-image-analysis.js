'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('cardImageAnalyses', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },     

      // properties
      eggCount: {
        type: Sequelize.INTEGER
      },      
      statusCode: {
        type: Sequelize.INTEGER,
      },     
      statusMessage: {
        type: Sequelize.TEXT,
      },
      analisysData: {
        type: Sequelize.JSON
      },
      
      // relations
      cardImageId: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // timestamps
      requestedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      retrievedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('cardImageAnalyses');
  }
};
