const errors = require("@feathersjs/errors");
const _ = require("lodash");

module.exports = (app, options) => {
  options = Object.assign(
    {},
    {
      idField: "id",
      path: undefined
    },
    options
  );

  if (app == undefined) {
    throw new Error("You must provide the app as the first argument.");
  }

  if (!options.path) {
    throw new Error("You must provide a service path");
  }

  return (req, res) => {
    const service = app.service(options.path);
    if (Array.isArray(req.body.ids)) {
      const ids = req.body.ids.map(id => id);
      service
        .find({
          skipResolver: true,
          paginate: false,
          query: {
            $select: ["id"],
            id: ids
          }
        })
        .then(results => {
          res.send(_.difference(ids, results.map(item => item.id)));
        })
        .catch(err => {
          throw new errors.GeneralError(err);
        });
    } else {
      throw new errors.BadRequest("Parameter 'ids' must be an Array");
    }
  };
};
