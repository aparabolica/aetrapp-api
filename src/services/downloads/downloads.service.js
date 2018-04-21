const _ = require("lodash");

// moment
const moment = require("moment-timezone");

// csv
const csvStringify = require('csv-stringify/lib/sync');

// config
const config = require("config");
const apiUrl = config.get('apiUrl');

// authentication
const { authenticate } = require('@feathersjs/authentication').express;

module.exports = function () {
  const app = this;

  app.get("/downloads/traps.csv", async function (req, res) {

    try {
      const trapsService = app.service('traps');

      let items = await trapsService.find({ query: req.query || {}, paginate: false });

      // prepare items
      items = _.map(items, item => {

        // list of properties allowed, to avoid exposing unwanted fields
        item = _.pick(item, [
          "id",
          "status",
          "eggCount",
          "eggCountDate",
          "isActive",
          "coordinates",
          "cycleDuration",
          "addressStreet",
          "addressComplement",
          "neighborhood",
          "postcode",
          "cityId",
          "stateId",
          "ownerId",
          "createdAt",
          "updatedAt",
          "cycleStart",
          "city",
          "sampleCount",
          "imageId"
        ]);

        // set image URL
        if (item.imageId) {
          item.imageUrl = apiUrl + '/files/' + item.imageId;
          delete item.imageId;
        }

        // parse dates
        if (item.eggCountDate) {
          item.eggCountDate = moment(item.eggCountDate).tz("Brazil/East").format();
        }
        item.createdAt = moment(item.createdAt).tz("Brazil/East").format();
        item.updatedAt = moment(item.updatedAt).tz("Brazil/East").format();
        item.cycleStart = moment(item.cycleStart).tz("Brazil/East").format();

        // transform geometry
        item.lon = item.coordinates.coordinates[0];
        item.lat = item.coordinates.coordinates[1];
        delete item.coordinates;

        item.stateId = item.city && item.city.stateId;
        item.city = item.city.name;

        return item;
      })

      const csvString = csvStringify(items, { header: true });

      res.set('Content-disposition', 'attachment; filename=traps.csv');
      res.set('Content-type', 'text/csv');
      res.send(csvString);

    } catch (error) {
      return res.status(500).send({ error: 'Error generating csv file.' });
    }
  });

  app.get("/downloads/samples.csv", function (req, res) {
    var results = [[
      'id',
      'trapId',
      'status',
      'eggCount',
      'errorCode',
      'errorMessage',
      'createdAt',
      'updatedAt',
      'collectedAt',
      'analysisStartedAt',
      'analysisFinishedAt',
      'imageUrl',
    ]];
    var query = "SELECT * FROM samples ORDER BY \"createdAt\" ASC";
    sequelizeClient.query(query)
      .then(function (queryResult) {
        queryResult[0].forEach(function (item) {
          results.push([
            item.id,
            item.trapId,
            item.status,
            item.eggCount,
            item.error && item.error.code,
            item.error && item.error.message,
            item.createdAt && moment(item.createdAt).tz("Brazil/East").format(),
            item.updatedAt && moment(item.updatedAt).tz("Brazil/East").format(),
            item.collectedAt && moment(item.collectedAt).tz("Brazil/East").format(),
            item.analysisStartedAt && moment(item.analysisStartedAt).tz("Brazil/East").format(),
            item.analysisFinishedAt && moment(item.analysisFinishedAt).tz("Brazil/East").format(),
            item.blobId && (apiUrl + '/files/' + item.blobId),
          ]);
        });
        csvStringify(results, function (err, csv) {
          if (err) return res.status(500).send({ error: 'Error generating csv file.' });
          else {
            res.set('Content-disposition', 'attachment; filename=samples.csv');
            res.set('Content-type', 'text/csv');
            res.send(csv);
          }
        });
      }).catch(function (err) {
        if (err) return res.status(500).send({ error: 'Error generating csv file.' });
      });
  });


  /*
    Using express auth from this recipe:
    https://docs.feathersjs.com/guides/auth/recipe.express-middleware.html

    To test this endpoint:

    curl 'http://localhost:3030/authentication/' -H 'Content-Type: application/json' --data-binary '{ "strategy": "local", "email": "user email", "password": "secret" }'

    curl 'http://localhost:3030/downloads/users.csv' -H 'Authorization: <token>'

  */
  app.use("/downloads/users.csv", authenticate('jwt'), function (req, res) {

    // check if user is admin
    if (!req.user.roles.includes('admin')) {
      res.status(401).send({ error: 'User must have admin role.' });
    }

    var results = [[
      'id',
      'email',
      'landlineNumber',
      'cellphoneNumber',
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'roles',
      'isActive',
      'isVerified',
      'createdAt',
      'updatedAt',
      'lastSignedInAt',
    ]];
    var query = "SELECT * FROM users ORDER BY \"createdAt\" ASC";
    sequelizeClient.query(query)
      .then(function (queryResult) {
        queryResult[0].forEach(function (item) {
          results.push([
            item.id,
            item.email,
            item.landlineNumber,
            item.cellphoneNumber,
            item.firstName,
            item.lastName,
            item.dateOfBirth,
            item.gender,
            item.roles,
            item.isActive,
            item.isVerified,
            item.createdAt && moment(item.createdAt).tz("Brazil/East").format(),
            item.updatedAt && moment(item.updatedAt).tz("Brazil/East").format(),
            item.lastSignedInAt && moment(item.lastSignedInAt).tz("Brazil/East").format(),
          ]);
        });
        csvStringify(results, function (err, csv) {
          if (err) return res.status(500).send({ error: 'Error generating csv file.' });
          else {
            res.set('Content-disposition', 'attachment; filename=users.csv');
            res.set('Content-type', 'text/csv');
            res.send(csv);
          }
        });
      }).catch(function (err) {
        if (err) return res.status(500).send({ error: 'Error generating csv file.' });
      });
  });

};
