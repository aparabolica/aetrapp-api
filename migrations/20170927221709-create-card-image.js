'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('cardImages', {
      // shortid https://www.npmjs.com/package/shortid
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      // properties
      caption: {
        type: Sequelize.TEXT
      },
      fileUrl: {
        type: Sequelize.STRING,
      },
      exifData: {
        type: Sequelize.JSON,
      },

      // relations
      trapId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      blobId: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // analysis data
      processed: {
        type: Sequelize.BOOLEAN
      },

      processedAt: {
        type: Sequelize.DATE
      },

      // timestamps (no updates)
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
    return queryInterface.dropTable('cardImages');
  }
};
