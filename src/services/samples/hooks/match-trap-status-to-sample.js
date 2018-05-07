const errors = require("@feathersjs/errors");
const { getItems } = require('feathers-hooks-common');

/*
 * Match trap status to sample
 */
module.exports = () => {
  return async function (context) {
    const sample = getItems(context);

    const traps = context.app.service("traps");
    let { trap } = context;
    if (trap) {
      await traps.patch(sample.trapId, {
        eggCount: sample.status == 'valid' ? sample.eggCount : null,
        status: sample.status
      }, { skipResolver: true });
      return context;
    } else throw new errors.BadRequest('Trap does not exist.');
  };
};
