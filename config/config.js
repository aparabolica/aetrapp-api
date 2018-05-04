const fs = require('fs');
const config = require('config');

/*
 * This file is used by sequelize-cli to run migrations, any configuration 
 * passed to 'config' module, via environment variable NODE_CONFIG or 
 * config files are used here.
 */

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
