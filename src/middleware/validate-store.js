const errors = require("feathers-errors");
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
    console.log("req.body",req.body);
    console.log("options",options);
    if (Array.isArray(req.body.ids)) {
      const ids = req.body.ids.map(id => id);
      service
        .find({
          query: {
            id: "{ $in: [ 'BkYyaU3ZG', 'HyGIOv3Zz', 'Bk8Ddw3-f', 'Hkh3dDhbM' ] }",
            // {
            //   $in: ids
            // },
            $select: ["id"]
          },
          paginate: false
        })
        .then(data => {
          res.send(_.difference(ids, data.map(item => item.id)));
        })
        .catch(err => {
          throw new errors.GeneralError(err);
        });
    } else {
      throw new errors.BadRequest();
    }
  };
};
