// Initializes the `cards` service on path `/cards`
const createService = require("feathers-sequelize");
const createModel = require("../../models/cards.model");
const hooks = require("./cards.hooks");
const validateStore = require("../../middleware/validate-store");

module.exports = function() {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get("paginate");

  const options = {
    name: "cards",
    Model,
    paginate
  };

  app.use("/cards/validate_store", validateStore(app, { path: "cards" }));

  // Initialize our service with any options it requires
  app.use("/cards", createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service("cards");

  app.use("/cards/analysis/:id", (req, res) => {
    const { results } = req.body;
    service
      .patch(
        null,
        Object.assign(
          {
            processed: true
          },
          results
        ),
        {
          query: {
            jobId: req.params.id
          }
        }
      )
      .then(() => {
        res.send("ok");
      })
      .catch(() => {
        res.send("ok");
      });
  });

  service.hooks(hooks);
};
