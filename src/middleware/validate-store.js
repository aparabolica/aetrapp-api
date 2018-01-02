const errors = require("feathers-errors");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


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
          attributes: ["id"],
          where: {
            id: {
              [Op.in]: ids
            }
          }
        },
        { paginate: false }
        )
        .then(results => {
          res.send(_.difference(ids, results.data.map(item => item.id)));
        })
        .catch(err => {
          throw new errors.GeneralError(err);
        });
    } else {
      throw new errors.BadRequest("Parameter 'ids' must be an Array");
    }
  };
};
