// Initializes the `samples` service on path `/samples`
const createService = require("feathers-sequelize");
const createModel = require("../../models/samples.model");
const hooks = require("./samples.hooks");
const validateStore = require("../../middleware/validate-store");

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get("paginate");

  const options = {
    name: "samples",
    Model,
    paginate
  };

  app.use("/samples/validate_store", validateStore(app, { path: "samples" }));

  // Initialize our service with any options it requires
  app.use("/samples", createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service("samples");

  app.use("/samples/analysis/:id", (req, res) => {
    service
      .patch(null, { ...req.body.results }, { query: { jobId: req.params.id } })
      .then(() => {
        res.send("ok");
      })
      .catch(() => {
        res.send("ok");
      });
  });

  service.hooks(hooks);
};
