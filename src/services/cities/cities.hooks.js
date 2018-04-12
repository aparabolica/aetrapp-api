const _ = require("lodash");
const moment = require("moment");
const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    find: [],
    get: [],
    create: disallow(),
    update: disallow(),
    patch: [disallow("external"), updateStatics()],
    remove: disallow()
  },
  after: {}
};

function updateStatics() {
  return async hook => {
    const traps = hook.app.services['traps'];
    const samples = hook.app.services['samples'];

    const trapIds = (await traps.find({
      skipResolver: true,
      query: {
        $select: ['id'],
        cityId: hook.id
      },
      paginate: false
    }));

    let validSamples = (await samples.find({
      skipResolver: true,
      query: {
        trapId: trapIds.map(trap => trap.id),
        status: 'valid',
        $select: ['id', 'eggCount', 'collectedAt'],
        $sort: { collectedAt: -1 }
      },
      paginate: false
    }));

    validSamples = validSamples.map(sample => {
      const collectedAt = moment(sample.collectedAt);
      sample.week = collectedAt.format('YYYY-w');
      return sample;
    });

    let weeks = _.groupBy(validSamples, 'week');

    for (const weekId in weeks) {
      if (weeks.hasOwnProperty(weekId)) {
        weeks[weekId] = _.meanBy(weeks[weekId], 'eggCount');
      }
    }

    hook.data = {
      eggCountAverages: weeks,
      eggCountAverageDate: moment(validSamples[0]).endOf("isoWeek")
    }

    return hook;
  }
}
