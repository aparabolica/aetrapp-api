const config = require('config');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const generateId = require('../helpers/generate-id');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const traps = sequelizeClient.define('traps', {
    id: {
      type: DataTypes.STRING,
      defaultValue: generateId,
      primaryKey: true
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: 'waiting-sample'
    },

    eggCount: {
      type: DataTypes.INTEGER
    },
    eggCountDate: {
      type: DataTypes.DATE
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    cycleDuration: { // in days
      type: DataTypes.FLOAT,
      defaultValue: config.get('cycleDuration')
    },

    imageId: {
      type: DataTypes.STRING
    },

    coordinates: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false
    },
    addressStreet: {
      type: DataTypes.STRING
    },
    addressComplement: {
      type: DataTypes.STRING
    },
    neighbourhood: {
      type: DataTypes.STRING
    },
    postcode: {
      type: DataTypes.STRING
    },
    cityId: {
      type: DataTypes.STRING
    },
    stateId: {
      type: DataTypes.STRING
    },

    // relations
    ownerId: {
      type: DataTypes.STRING
    },

    // timestamps
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cycleStart: {
      type: DataTypes.DATE,
      defaultValue: Date.now
    },
  }, {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    });

  traps.associate = function (models) { // eslint-disable-line no-unused-vars
    traps.belongsTo(models.cities);
    traps.hasMany(models.samples);
  };

  return traps;
};
