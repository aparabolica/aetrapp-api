const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const generateId = require('../helpers/generate-id');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: Sequelize.STRING,
      defaultValue: generateId,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // E-mail verification & reset
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verifyToken: { type: DataTypes.STRING },
    verifyExpires: { type: DataTypes.DATE },
    verifyChanges: { type: DataTypes.JSON },
    resetToken: { type: DataTypes.STRING },
    resetExpires: { type: DataTypes.DATE },

    // e-mail
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    // phone numbers
    landlineNumber: {
      type: DataTypes.STRING
    },
    cellphoneNumber: {
      type: DataTypes.STRING
    },

    // personal info
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.STRING
    },

    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },

    // Cached statistics
    trapCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    delayedTrapCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  users.associate = function (models) { // eslint-disable-line no-unused-vars
    users.belongsToMany(models.cities, {
      through: 'citiesMaintainers'
    });
  };
  return users;
};
