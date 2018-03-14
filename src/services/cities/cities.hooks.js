const _ = require('lodash');
const moment = require('moment');
const { disallow, fastJoin } = require('feathers-hooks-common');

const cityResolver = {
  joins: {
    eggMeanSeries: (...args) => async (city, context) => {
      const traps = context.app.services['traps'];
      const samples = context.app.services['samples'];

      const trapIds = (await traps.find({
        query: {
          $select: ['id'],
          cityId: city.id
        },
        paginate: false
      }));

      let validSamples = (await samples.find({
        query: {
          trapId: trapIds.map(trap => trap.id),
          status: 'valid',
          $select: ['id', 'eggCount', 'collectedAt']
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

      city.eggMeanSeries = weeks;

    }
  }
}

module.exports = {
  before: {
    find: [],
    get: [],
    create: disallow(),
    update: disallow(),
    patch: disallow(),
    remove: disallow()
  },
  after: {
    find: [fastJoin(cityResolver)],
    get: [fastJoin(cityResolver)],
  }
};
