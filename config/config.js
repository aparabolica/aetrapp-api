const fs = require('fs');
const config = require('config');

module.exports = {
  development: {
    "url": config.get("postgres"),
    // uncomment this to use sequelize-cli outside the docker container
    // "url": "postgres://aetrapp:aetrapp@localhost:15432/aetrapp",
    seederStorage: 'sequelize'
  },
  test: {
    "url": config.get("postgres"),
    seederStorage: 'sequelize'
  },
  production: {
    "url": config.get("postgres"),
    seederStorage: 'sequelize'
  }
};
