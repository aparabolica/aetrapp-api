'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('cardImages', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING(7),
        primaryKey: true
      },     

      // properties
      filePath: {
        type: Sequelize.STRING
      },
      exifData: {
        type: Sequelize.JSON,
      },     

      // relations
      trapId: {
        type: Sequelize.STRING,
        allowNull: false
      },      

      // timestamps (no updates)
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('cardImages');
  }
};
