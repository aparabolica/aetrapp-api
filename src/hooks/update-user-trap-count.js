module.exports = () => {
  return async context => {

    const traps = context.app.service("traps");

    const trap = await traps.get(context.id, {
      skipResolver: true
    });

    const trapCount = await traps.find({
      skipResolver: true,
      query: {
        ownerId: trap.ownerId,
        $limit: 0
      }
    })

    const delayedTrapCount = await traps.find({
      skipResolver: true,
      query: {
        ownerId: trap.ownerId,
        status: "delayed",
        $limit: 0
      }
    })

    const users = context.app.service("users");

    users.patch(trap.ownerId, {
      trapCount: trapCount.total,
      delayedTrapCount: delayedTrapCount.total
    })

  };
};
