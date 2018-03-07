const fs = require('fs');
const config = require('config');

module.exports = {
  development: {
    ...config.get("sequelize"),
    seederStorage: 'sequelize'
  },
  test: {
    ...config.get("sequelize"),
    seederStorage: 'sequelize'
  },
  production: {
    ...config.get("sequelize"),
    seederStorage: 'sequelize'
  }
};
