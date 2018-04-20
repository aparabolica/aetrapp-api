const _ = require("lodash");
const csvStringify = require('csv-stringify/lib/sync')

// config
const config = require("config");
const apiUrl = config.get('apiUrl');

// hooks
const { getItems } = require("feathers-hooks-common");

module.exports = () => {
  return async context => {

    if (!context.params.format || !context.params.format == 'csv') return context;

    let items = getItems(context);

    items = _.map(items, item => {
      if (item.imageId) {
        item.imageUrl = apiUrl + '/files/' + item.imageId;
        delete item.imageId;
      }

      item.lon = item.coordinates.coordinates[0];
      item.lat = item.coordinates.coordinates[1];
      delete item.coordinates;

      item.stateId = item.city && item.city.stateId;
      item.city = item.city.name;

      delete item.owner;

      return item;
    })

    const csvString = csvStringify(items, { header: true });

    context.result = csvString;

    return context;
  };
};
