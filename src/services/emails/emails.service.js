// Initializes the `email` service on path `/email`
const hooks = require('./emails.hooks');
const Mailer = require('feathers-mailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const config = require('config');


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  // Initialize our service with any options it requires
  app.use('/emails', Mailer(mailgunTransport({
    auth: config.get('mailgun'),
  })));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emails');

  service.hooks(hooks);
};
