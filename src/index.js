/* eslint-disable no-console */

/*
   Set appRoot as a global variable. Reference:
   https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
*/
var path = require('path');
global.appRoot = path.resolve(__dirname);

const logger = require('winston');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
