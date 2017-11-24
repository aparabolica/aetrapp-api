// Initializes the `images` service on path `/images`
const createService = require('feathers-sequelize');
const createModel = require('../../models/images.model');
const hooks = require('./images.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'images',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/images', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('images');

  app.use('/images/analysis/:id', (req, res) => {
    console.log(req.body, req.params);
    service.patch(req.params.id, {
      eggCount: req.body.results.eggCount
    }).then(() => {
      res.send('ok');
    }).catch(() => {
      res.send('ok');
    });
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(function (data, connection, hook) {
      return data;
    });
  }
};
