// Initializes the `layers` service on path `/layers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/layers.model');
const hooks = require('./layers.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'layers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/layers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('layers');

  service.hooks(hooks);
};
