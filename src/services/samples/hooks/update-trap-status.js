const errors = require("@feathersjs/errors");

/*
 * Update trap status
 */
module.exports = status => {
  return async function (context) {
    const traps = context.app.service("traps");
    let { trap } = context;
    if (trap)
      await traps.patch(trap.id, { status }, { skipResolver: true });
    else
      throw new errors.BadRequest('Trap does not exist.');
  };
};
