const _ = require('lodash');
const moment = require('moment');
const { Op } = require('sequelize');

module.exports = () => {
  return async context => {
    const traps = context.app.services['traps'];
    const samples = context.app.services['samples'];

    // get traps belonging to city
    const trapIds = await traps.find({
      skipResolver: true,
      query: {
        $select: ['id'],
        cityId: context.id
      },
      paginate: false
    });

    // get last week finish date
    const lastWeekFinishedAt = moment().subtract(7, 'days').endOf('isoWeek');

    // get valid samples until last week
    let validSamples = await samples.find({
      skipResolver: true,
      query: {
        status: 'valid',
        collectedAt: {
          [Op.lte]: lastWeekFinishedAt.toDate()
        },
        trapId: trapIds.map(trap => trap.id),
        $select: ['id', 'eggCount', 'collectedAt'],
        $sort: { collectedAt: -1 }
      },
      paginate: false
    });

    // get last valid sample week
    const lastValidCountDate = moment(validSamples[0].collectedAt);

    // aggregate in weeks
    validSamples = validSamples.map(sample => {
      const collectedAt = moment(sample.collectedAt);
      sample.week = collectedAt.format('YYYY-w');
      return sample;
    });
    let weeks = _.groupBy(validSamples, 'week');

    // transform to hash
    for (const weekId in weeks) {
      if (weeks.hasOwnProperty(weekId)) {
        weeks[weekId] = _.meanBy(weeks[weekId], 'eggCount');
      }
    }

    context.data = {
      eggCountAverage: weeks[lastValidCountDate.format('YYYY-w')],
      eggCountAverageDate: lastWeekFinishedAt.endOf('isoWeek').toDate(),
      eggCountAverages: weeks,
    }

    return context;
  }
}
