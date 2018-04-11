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
  const samplesService = app.service("samples");

  app.use("/samples/analysis/:id", (req, res) => {

    // Get sample to patch
    samplesService
      .find({ query: { jobId: req.params.id } })
      .then(samples => {
        const sample = samples.data[0];

        // Perform patch
        samplesService
          .patch(sample.id, { ...req.body.results })
          .catch(err => {
            console.log("Error patching sample with analysis result:", err.message);
          })
          .finally(() => res.send("ok"));
      })
      .catch(() => {
        res.send("ok");
      });
  });

  samplesService.hooks(hooks);
};
