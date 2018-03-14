const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const shortid = require('shortid');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const traps = sequelizeClient.define('traps', {
    id: {
      type: DataTypes.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    cycleDuration: { // in days
      type: DataTypes.FLOAT,
      defaultValue: 2
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
    neighborhood: {
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
