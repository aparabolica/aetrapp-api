const moment = require('moment-timezone');
const csvStringify = require('csv-stringify');

module.exports = function () {
  const app = this;

  const sequelizeClient = app.get('sequelizeClient');

  app.get("/downloads/traps.csv", function (req, res) {
    var results = [['id', 'createdAt']];
    var query = "SELECT * FROM traps ORDER BY \"createdAt\" ASC";
    sequelizeClient.query(query)
      .then(function (queryResult) {
        queryResult[0].forEach(function (item) {
          var time = moment(item.createdAt);
          results.push([
            item.id,
            time.tz("Brazil/East").format()
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
    var results = [['id', 'createdAt']];
    var query = "SELECT * FROM samples ORDER BY \"createdAt\" ASC";
    sequelizeClient.query(query)
      .then(function (queryResult) {
        queryResult[0].forEach(function (item) {
          var time = moment(item.createdAt);
          results.push([
            item.id,
            time.tz("Brazil/East").format()
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
};
