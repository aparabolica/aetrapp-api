// Initializes the `traps` service on path `/traps`
const createService = require('feathers-sequelize');
const createModel = require('./traps.model');
const hooks = require('./traps.hooks');
const validateStore = require("../../middleware/validate-store");

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'traps',
    Model,
    paginate
  };

  app.use("/traps/validate_store", validateStore(app, { path: "traps" }));

  // Initialize our service with any options it requires
  app.use('/traps', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('traps');

  service.hooks(hooks);
};
