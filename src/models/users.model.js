const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const shortid = require('shortid');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: Sequelize.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // e-mail
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    emailIsVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
