const { iff, fastJoin } = require("feathers-hooks-common");

module.exports = resolver => {
  return iff(hook => hook.params && !hook.params.skipResolver, fastJoin(resolver));
};
