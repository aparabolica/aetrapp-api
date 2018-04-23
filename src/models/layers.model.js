const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const generateId = require('../helpers/generate-id');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const layers = sequelizeClient.define('layers', {
    id: {
      type: DataTypes.STRING,
      defaultValue: generateId,
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
  }, {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    });

  return layers;
};
