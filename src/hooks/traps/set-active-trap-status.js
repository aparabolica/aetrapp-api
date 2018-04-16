const moment = require('moment');

module.exports = () => {
  return async context => {

    const { data } = context;

    if (data && data.status && data.status == 'active') {

      const cities = context.app.service("cities");
      const traps = context.app.service("traps");

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

      // if trap and city count are recent, set status as comparison to average
      const aWeekAgo = moment().subtract(7, 'days').toDate();

      // set status
      if (trap.eggCount == 0) {
        context.data.status = 'no-eggs';
      } else if ( // check if trap and city has recent counts
        city.eggCountAverage
        && trap.eggCount
        && city.eggCountAverageDate >= aWeekAgo
        && trap.eggCountDate >= aWeekAgo
      ) {

        // if so, set trap status as a comparison to city average
        if (trap.eggCount > city.eggCountAverage) {
          context.data.status = 'above-average';
        } else if (trap.eggCount < city.eggCountAverage) {
          context.data.status = 'bellow-average';
        } else if (trap.eggCount == city.eggCountAverage) {
          context.data.status = 'on-average';
        }
      } else { // otherwise, set "wait for sample" status
        context.data.status = 'waiting-sample';
      }
    }

    return context;
  };
};
