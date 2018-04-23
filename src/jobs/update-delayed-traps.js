const config = require('config');
const moment = require('moment');

// Sequelize
const Sequelize = require("sequelize");
const { Op } = Sequelize;

/*
 * Find traps delayed traps and update their statuses
 */
module.exports = async app => {

  const cycleDuration = config.get("cycleDuration");
  const traps = app.service("traps");

  const delayedDate = moment().subtract(cycleDuration, 'days').toDate();

  const delayedTraps = await traps.find({
    skipResolver: true,
    query: {
      cycleStart: {
        [Op.lt]: delayedDate
      },
      status: {
        [Op.ne]: "inactive"
      },
    },
    paginate: false
  })

  if (delayedTraps && delayedTraps.length > 0) {
    delayedTraps.forEach(async trap => {
      await traps.patch(trap.id, { status: 'delayed' });
    });
  }
}
