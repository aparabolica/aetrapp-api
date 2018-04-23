'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    return queryInterface.createTable("layers", {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      properties: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      tooltip: {
        type: DataTypes.JSON
      },
      geojson: {
        type: DataTypes.JSON,
        allowNull: false
      },
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
    return queryInterface.dropTable('layers');
  }
};
