const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const generateId = require('../helpers/generate-id');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const notifications = sequelizeClient.define('notifications', {
    id: {
      type: DataTypes.STRING,
      defaultValue: generateId,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.STRING
    },
    trapId: {
      type: DataTypes.STRING
    },
    senderId: {
      type: DataTypes.STRING
    },
    recipientId: {
      type: DataTypes.STRING
    },
    payload: {
      type: DataTypes.JSONB
    },
    includeSegments: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    excludeSegments: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    recipientCities: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    deliveryTime: {
      type: DataTypes.DATE,
      defaultValue: Date.now
    }
  }, {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    });
  return notifications;
};
