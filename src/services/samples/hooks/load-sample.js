
/*
 * Load sample to context if not available
 */

module.exports = () => {
  return async function (context) {
    let { sample } = context;
    if (!sample) {
      const samples = context.app.service("samples");
      sample = await samples.get(context.id, {
        skipResolver: true
      });
      context.sample = sample;
      return context;
    }
  };
};
