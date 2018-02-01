const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    find: [],
    get: [],
    create: disallow(),
    update: disallow(),
    patch: disallow(),
    remove: disallow()
  }
};
