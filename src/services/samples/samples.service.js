// Initializes the `samples` service on path `/samples`
const logger = require('winston');
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

  /*
   * Define webhook endpoint to be accessed by IPS
   */
  app.use("/samples/analysis/:id", async (req, res) => {

    // Get sample to patch
    return samplesService
      .find({ query: { jobId: req.params.id } })
      .then(samples => {
        const sample = samples.data[0];
        // Perform patch
        samplesService
          .patch(sample.id, { ...req.body.results })
          .then(()=>{
            return res.status(200).send('ok');
          })
          .catch(err => {
            logger.error("Error patching sample with analysis result:", err.message);
            return res.status(500).json({ error: err.message });
          });
      })
      .catch(err => {
        res.status(404).json({ error: err.message });
      });
  });

  samplesService.hooks(hooks);
};
