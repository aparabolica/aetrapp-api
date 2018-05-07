const { getItems } = require('feathers-hooks-common');
const errors = require("@feathersjs/errors");

module.exports = () => {
  return async function (context) {
    let { trap } = context;
    const sample = getItems(context);

    if (!trap) {
      const traps = context.app.service("traps");
      const trapId = (sample && sample.trapId);
      trap = await traps.get(trapId, {
        skipResolver: true
      }).catch(() => { return new errors.BadRequest("Could not find sample."); });
      context.trap = trap;
      return context;
    }
  };
};
