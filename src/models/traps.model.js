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

    statusCode: {
      type: DataTypes.INTEGER
    },

    statusMessage: {
      type: DataTypes.TEXT
    },

    cycleDuration: DataTypes.FLOAT, // in days

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
    addressNumber: {
      type: DataTypes.STRING
    },
    addressComplement: {
      type: DataTypes.STRING
    },
    addressNeighborhood: {
      type: DataTypes.STRING
    },
    addressPostcode: {
      type: DataTypes.STRING
    },
    addressCityId: {
      type: DataTypes.STRING
    },
    addressStateId: {
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
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  traps.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return traps;
};
