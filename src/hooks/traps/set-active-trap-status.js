const moment = require('moment');
const config = require('config');

// Sequelize
const Sequelize = require("sequelize");
const { Op } = Sequelize;

module.exports = () => {
  return async context => {

    const { data } = context;

    const cities = context.app.service("cities");
    const traps = context.app.service("traps");
    const samples = context.app.service("samples");

    // load trap if not available
    let { trap } = context;
    if (!trap) {
      trap = await traps.get(context.id, {
        skipResolver: true
      });
    }

    // load city if not available
    let { city } = context;
    if (!city) {
      city = await cities.get(trap.cityId, {
        skipResolver: true
      });
    }

    // trap will be set as inactive, the comparison is not needed
    if (data && data.status && data.status == 'inactive') return context;

    // trap will be active or a new sample fired an status update
    if ((data && data.status && data.status == 'active') || (trap.status != 'inactive')) {

      // check if a valid sample exists in last week
      const aWeekAgo = moment().subtract(7, 'days').toDate();
      let recentValidSample = await samples.find({
        query: {
          trapId: trap.id,
          collectedAt: {
            [Op.gte]: aWeekAgo
          },
          status: 'valid',
          $limit: 1,
          $sort: {
            collectedAt: -1
          }
        },
        paginate: false
      });

      // if there is a recent sample
      if (recentValidSample && recentValidSample.length > 0 && city.eggCountAverageDate) {
        recentValidSample = recentValidSample[0];

        const sampleAge = moment(recentValidSample.collectedAt).diff(city.eggCountAverageDate, 'days');

        let cityCountAverage;
        if (sampleAge <= 7) {
          cityCountAverage = city.eggCountAverage;
        }

        // set status
        if (recentValidSample.eggCount == 0) {
          context.data.status = 'no-eggs';
          // if city has recent count, set status as comparison
        } else if (typeof cityCountAverage != undefined) {
          // if so, set trap status as a comparison to city average
          if (recentValidSample.eggCount > cityCountAverage) {
            context.data.status = 'above-average';
          } else if (recentValidSample.eggCount <= cityCountAverage) {
            context.data.status = 'below-average';
          }
        } else {
          context.data.status = 'waiting-sample';
        }
        // init new cycle
        context.data.cycleStart = new Date();
        context.data.cycleDuration = config.get('cycleDuration');
      }

      if (context.data && context.data.status && context.data.status == 'active') context.data.status = 'waiting-sample';

    }

    return context;
  };
};
