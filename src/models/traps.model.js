// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const shortid = require('shortid');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const traps = sequelizeClient.define('traps', {
    // shortid https://www.npmjs.com/package/shortid
    id: {
      type: Sequelize.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },

    userOrder: {
      type: Sequelize.INTEGER
    },

    // properties
    // timestamps
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    statusCode: {
      type: Sequelize.INTEGER
    },
    statusMessage: {
      type: Sequelize.TEXT
    },
    daysToCollect: Sequelize.INTEGER,
    title: {
      type: Sequelize.STRING
    },
    notes: {
      type: Sequelize.TEXT,
    },

    imageId: {
      type: Sequelize.STRING
    },

    // location
    coordinates: {
      type: Sequelize.GEOMETRY('POINT', 4326)
    },
    addressStreet: {
      type: Sequelize.STRING
    },
    addressNumber: {
      type: Sequelize.STRING
    },
    addressComplement: {
      type: Sequelize.STRING
    },
    addressNeighborhood: {
      type: Sequelize.STRING
    },
    addressPostcode: {
      type: Sequelize.STRING
    },
    addressCityId: {
      type: Sequelize.STRING
    },
    addressStateId: {
      type: Sequelize.STRING
    },

    // relations
    ownerId: {
      type: Sequelize.STRING
    },

    // timestamps
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

  traps.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return traps;
};
