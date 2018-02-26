// Initializes the `users` service on path `/users`
const errors = require('@feathersjs/errors');
const createService = require('feathers-sequelize');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'users',
    Model,
    paginate
  };

  app.use("/users/:userId/allowedCities", {
    find(params) {
      return new Promise(function (resolve, reject) {
        const { models } = app.get("sequelizeClient");
        const { userId } = params.route;
        return models.users
          .findById(userId)
          .then(function (user) {
            return user.getCities().then(cities=>{
              resolve(cities);
            }).catch(reject);
          })
          .catch(function (err) {
            reject(new errors.NotFound("City not found."));
          });
      });
    },
    create(data, params) {
      return new Promise(function (resolve, reject) {
        const { models } = app.get("sequelizeClient");
        const { userId } = params.route;
        var { cityId } = data;

        if (cityId)
          // check if city exists and create association
          return models.cities
            .findById(cityId)
            .then(function (city) {
              return city.addMaintainer(userId).then(res => {
                resolve({});
              }).catch(err => {
                reject(new errors.GeneralError(`Association failed. Does user with id="${userId}" exists?`))
              });
            })
            .catch(function (err) {
              reject(new errors.NotFound("City not found."));
            });
        else
          reject(new errors.BadRequest("Missing 'cityId' parameter."));
      });
    },
    remove(id, params) {
      return new Promise(function (resolve, reject) {

        const { models } = app.get("sequelizeClient");
        const { userId } = params.route;
        var { cityId } = params.query;

        if (cityId)
          // check if city exists and create association
          return models.cities
            .findById(cityId)
            .then(function (city) {
              return city.removeMaintainer(userId).then(res => {
                if (res)
                  resolve({})
                else
                  reject(new errors.NotFound(`Dissociation failed, does it exist?`));
              }).catch(err => {
                reject(new errors.GeneralError("Could not associate maintainer to city."))
              });
            })
            .catch(function (err) {
              reject(new errors.NotFound("City not found."));
            });
        else
          reject(new errors.BadRequest("Missing 'cityId' parameter."));
      });
    }
  });

  // Initialize our service with any options it requires
  app.use('/users', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  service.hooks(hooks);
};
