const config = require('config');

module.exports = () => {
  return async context => {
    context.data.cycleStart = new Date();
    context.data.cycleDuration = config.get('cycleDuration');
    return context;
  };
};
