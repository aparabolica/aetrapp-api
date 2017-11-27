'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const DataTypes = Sequelize.DataTypes;
    return queryInterface.createTable("cardImages", {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      // properties
      caption: {
        type: DataTypes.TEXT
      },
      fileUrl: {
        type: DataTypes.STRING
      },
      exifData: {
        type: DataTypes.JSON
      },

      // relations
      trapId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      blobId: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // analysis data
      processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      error: {
        type: DataTypes.JSON
      },
      analysisStartedAt: {
        type: DataTypes.DATE
      },
      analysisFinishedAt: {
        type: DataTypes.DATE
      },

      processedAt: {
        type: DataTypes.DATE
      },

      eggCount: {
        type: DataTypes.INTEGER
      },

      // timestamps (no updates)
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('cardImages');
  }
};
