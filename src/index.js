/* eslint-disable no-console */

const logger = require('winston');

/*
   Set appRoot as a global variable. Reference:
   https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
*/
var path = require('path');
global.appRoot = path.resolve(__dirname);

// App
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () => {
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)

  // Schedule job
  const updateDelayedTraps = require('./jobs/update-delayed-traps');
  setInterval(() => updateDelayedTraps(app), 5000);
});


// Catch unhandled promises
process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);
