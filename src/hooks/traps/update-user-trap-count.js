module.exports = () => {
  return async context => {
    const traps = context.app.service("traps");
    const users = context.app.service("users");

    // load trap if not available
    let { trap } = context;
    if (!trap) {
      trap = await traps.get(context.id, {
        skipResolver: true
      });
    }

    // get users' traps count
    const trapCount = await traps.find({
      skipResolver: true,
      query: {
        ownerId: trap.ownerId,
        $limit: 0
      }
    })

    // get users' delayed traps count
    const delayedTrapCount = await traps.find({
      skipResolver: true,
      query: {
        ownerId: trap.ownerId,
        status: "delayed",
        $limit: 0
      }
    })

    // update users' trap counts
    users.patch(trap.ownerId, {
      trapCount: trapCount.total,
      delayedTrapCount: delayedTrapCount.total
    })
  };
};
