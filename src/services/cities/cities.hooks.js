const _ = require("lodash");
const moment = require("moment");
const { disallow } = require('feathers-hooks-common');
const { updateCityStatistics } = require('../../hooks');


module.exports = {
  before: {
    find: [],
    get: [],
    create: disallow(),
    update: disallow(),
    patch: [disallow("external"), updateCityStatistics()],
    remove: disallow()
  },
  after: {}
};
