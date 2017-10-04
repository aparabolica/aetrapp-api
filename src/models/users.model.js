// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
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
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },

    // phone numbers
    landlineNumber: {
      type: Sequelize.STRING
    },
    cellphoneNumber: {
      type: Sequelize.STRING
    },

    // personal info
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: Sequelize.DATEONLY,
    },
    gender: {
      type: Sequelize.STRING
    },

    // meta
    roles: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  users.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
