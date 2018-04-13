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
    },
    eggCountAverage: {
      type: DataTypes.FLOAT
    },
    eggCountAverageDate: {
      type: DataTypes.DATE
    },
    eggCountAverages: {
      type: DataTypes.JSONB
    }
  }, {
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    });

  cities.associate = function (models) { // eslint-disable-line no-unused-vars
    cities.belongsToMany(models.users, {
      as: 'maintainers',
      through: 'citiesMaintainers'
    });
    cities.hasMany(models.traps);
  };

  return cities;
};
