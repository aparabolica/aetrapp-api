const config = require('config');
const moment = require('moment-timezone');
const csvStringify = require('csv-stringify');

const { authenticate } = require('@feathersjs/authentication').express;

module.exports = function () {
  const app = this;

  const apiUrl = config.get('apiUrl');

  const sequelizeClient = app.get('sequelizeClient');

  app.get("/downloads/traps.csv", function (req, res) {
    var results = [[
      'id',
      'lon',
      'lat',
      'addressStreet',
      'addressComplement',
      'neighborhood',
      'postcode',
      'cityId',
      'stateId',
      'createdAt',
      'updatedAt',
      'isActive',
      'cycleDuration',
      'cycleStart',
      'imageUrl'
    ]];
    var query = "SELECT * FROM traps ORDER BY \"createdAt\" ASC";
    sequelizeClient.query(query)
      .then(function (queryResult) {
        queryResult[0].forEach(function (item) {
          var time = moment(item.createdAt);
          results.push([
            item.id,
            item.coordinates.coordinates[0],
            item.coordinates.coordinates[1],
            item.addressStreet,
            item.addressComplement,
            item.neighborhood,
            item.postcode,
            item.cityId,
            item.stateId,
            moment(item.createdAt).tz("Brazil/East").format(),
            moment(item.updatedAt).tz("Brazil/East").format(),
            item.isActive ? 1 : 0,
            item.cycleDuration,
            moment(item.cycleStart).tz("Brazil/East").format(),
            item.imageId && (apiUrl + '/files/' + item.imageId),
          ]);
        });
        csvStringify(results, function (err, csv) {
          if (err) return res.status(500).send({ error: 'Error generating csv file.' });
          else {
            res.set('Content-disposition', 'attachment; filename=traps.csv');
            res.set('Content-type', 'text/csv');
            res.send(csv);
          }
        });
      }).catch(function (err) {
        if (err) return res.status(500).send({ error: 'Error generating csv file.' });
      });
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
