// Initializes the `traps` service on path `/traps`
const createService = require('feathers-sequelize');
const createModel = require('../../models/traps.model');
const hooks = require('./traps.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'traps',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/traps', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('traps');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(function (data, connection, hook) {
      return data;
    });
  }
};
