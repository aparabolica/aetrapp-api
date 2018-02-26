const shortid = require('shortid');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const notifications = sequelizeClient.define('notifications', {
    id: {
      type: DataTypes.STRING,
      defaultValue: shortid.generate,
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
    senderId: {
      type: DataTypes.STRING
    },
    recipientId: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.JSON
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
