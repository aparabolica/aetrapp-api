const url = require('url');
const app = require('../src/app');

const port = app.get('port') || 3030;
global.getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application tests', () => {
  before(function(done) {
    this.server = app.listen(port);
    this.server.once('listening', () => {
      global.app = app;
      done();
    });
  });

  /*
   * Test files are required as bellow to make sure they are executed
   * in the exact order they are declared.
   */
  require('./public.test.js');

  after(function(done) {
    this.server.close(done);
  });
});
