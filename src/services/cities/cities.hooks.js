const _ = require('lodash');
const moment = require('moment');
const { disallow, fastJoin } = require('feathers-hooks-common');

module.exports = {
  before: {
    find: [],
    get: [],
    create: disallow(),
    update: disallow(),
    patch: disallow(),
    remove: disallow()
  },
  after: {
  }
};
