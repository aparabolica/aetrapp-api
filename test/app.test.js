const url = require('url');
const app = require('../src/app');

const port = app.get('port') || 3030;
global.getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

// helpers
const UserClientFactory = require('./helpers/user-client-factory');

describe('Feathers application tests', () => {
  before(function (done) {
    this.server = app.listen(port);
    this.server.once('listening', async () => {
      global.app = app;

      // Clear database
      const sequelizeClient = app.get('sequelizeClient');
      sequelizeClient.query("DELETE FROM USERS;");

      /*
       * Create user clients
       */
      global.unloggedUser = await UserClientFactory(app).catch(err => { return done(err); });

      global.loggedAdmin = await UserClientFactory(app, {
        firstName: 'Admin',
        lastName: '1',
        email: 'admin@aetrapp.org',
        password: '123456'
      }).catch(err => { return done(err); });

      global.loggedRegularUser1 = await UserClientFactory(app, {
        firstName: 'User',
        lastName: '1',
        email: 'user1@aetrapp.org',
        password: '123456'
      }).catch(err => { return done(err); });

      done();
    });
  });

  /*
   * Test files are required as bellow to make sure they are executed
   * in the exact order they are declared.
   */
  require('./public.test.js');
  require('./traps.test.js');

  after(function (done) {
    this.server.close(done);
  });
});
