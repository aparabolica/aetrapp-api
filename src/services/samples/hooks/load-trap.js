
/*
 * Load trap
 */

module.exports = () => {
  return async function (context) {
    let { trap, sample, data } = context;
    if (!trap) {
      const traps = context.app.service("traps");
      const trapId = ((data && data.trapId) || (sample && sample.trapId));
      trap = await traps.get(trapId, {
        skipResolver: true
      });
      context.trap = trap;
      return context;
    }
  };
};
