const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');

const superagent = require('superagent');
const localStorage = require('localstorage-memory');

module.exports = async function (app, user) {

  const feathersClient = feathers();

  // create user
  const usersService = app.service('users');
  await usersService.create({...user});

  feathersClient
    .configure(
      rest('http://localhost:3030')
        .superagent(superagent)
    )
    .configure(auth({ storage: localStorage }));

  return feathersClient
    .authenticate({
      strategy: 'local',
      email: user.email,
      password: user.password
    })
    .then(response => {
      return feathersClient.passport.verifyJWT(response.accessToken);
    })
    .then(payload => {
      return feathersClient.service('users').get(payload.userId);
    })
    .then(user => {
      feathersClient.set('user', user);
    });
}
