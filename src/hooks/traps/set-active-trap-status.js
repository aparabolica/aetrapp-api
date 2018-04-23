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

      // check if a valid sample exists in current cycle
      let validSampleInCycle = await samples.find({
        query: {
          trapId: trap.id,
          collectedAt: {
            [Op.gte]: trap.cycleStart,
            [Op.lte]: moment(trap.cycleStart).add(trap.cycleDuration + 1, 'days').toDate()
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
      if (validSampleInCycle && validSampleInCycle.length > 0) {
        validSampleInCycle = validSampleInCycle[0];

        const aWeekAgo = moment().subtract(7, 'days').toDate();

        let cityCountAverage;
        if (city.eggCountAverageDate && city.eggCountAverageDate >= aWeekAgo) {
          cityCountAverage = city.eggCountAverage;
        }

        // set status
        if (validSampleInCycle.eggCount == 0) {
          context.data.status = 'no-eggs';

          // if city has recent count, set status as comparison
        } else if (typeof cityCountAverage != undefined) {
          // if so, set trap status as a comparison to city average
          if (validSampleInCycle.eggCount > cityCountAverage) {
            context.data.status = 'above-average';
          } else if (validSampleInCycle.eggCount <= cityCountAverage) {
            context.data.status = 'bellow-average';
          }
        } else {
          context.data.status = 'waiting-sample';
        }

        // init new cycle
        context.data.cycleStart = new Date();
        context.data.cycleDuration = config.get('cycleDuration');
      }
    }

    return context;
  };
};
