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
    templateId: {
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
    locations: {
      type: DataTypes.JSON
    },
    deliveryTime: {
      type: DataTypes.DATE
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
