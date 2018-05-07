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
    if (trap)
      await traps.patch(trap.id, { status: sample.status }, { skipResolver: true });
    else
      throw new errors.BadRequest('Trap does not exist.');
  };
};
