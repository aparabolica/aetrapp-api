const createService = require("feathers-sequelize");
const createModel = require("../../models/notifications.model");
const hooks = require("./notifications.hooks");
const validateStore = require("../../middleware/validate-store");

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get("paginate");

  const options = {
    name: "notifications",
    Model,
    paginate
  };

  // Setup validate store
  app.use("/notifications/validate_store", validateStore(app, { path: "notifications" }));

  // Initialize our service with any options it requires
  app.use("/notifications", createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service("notifications");

  service.hooks(hooks);
};
