const accountService = require('../services/auth-management/notifier');
const config = require('config');

module.exports = (options = {}) => hook => {

  if (!hook.params.provider) { return hook; }

  const user = hook.result;

  if(config.get('mailgun') && hook.data && hook.data.email && user) {
    accountService(hook.app).notifier('resendVerifySignup', user);
    return hook;
  }

  return hook;
}
