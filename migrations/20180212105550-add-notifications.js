'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const DataTypes = Sequelize.DataTypes;
    return queryInterface.createTable("notifications", {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.TEXT
      },
      templateId: {
        type: DataTypes.STRING
      },
      data: {
        type: DataTypes.JSON
      },
      locations: {
        type: DataTypes.JSON
      },
      includeSegments: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      excludeSegments: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      deliveryTime: {
        type: DataTypes.DATE
      },
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("notifications");
  }
};
