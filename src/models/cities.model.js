const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const cities = sequelizeClient.define('cities', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    stateId: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    isCapital: {
      type: DataTypes.BOOLEAN
    },
    point: {
      type: DataTypes.GEOMETRY('POINT', 4326)
    },
    withoutAccents: {
      type: DataTypes.STRING
    },
    alternativeNames: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    microregion: {
      type: DataTypes.STRING
    },
    mesoregion: {
      type: DataTypes.STRING
    }
  }, {
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    });

  return cities;
};
