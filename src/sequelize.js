const config = require('config');
const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const { database, username, password, host, dialect } = config.get('sequelize');
  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging: false,
    define: {
      freezeTableName: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    sequelize.sync();

    return result;
  };
};
