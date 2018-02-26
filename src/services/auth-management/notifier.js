const isProd = process.env.NODE_ENV === 'production'
const path = require('path')
const returnEmail = process.env.COMPLAINT_EMAIL

const pug = require('pug')

module.exports = function (app) {

  const config = require('config');
  const webappUrl = config.get('webappUrl');
  const returnEmail = config.get('supportEmail');
  const senderEmail = config.get('mailgun').senderEmail;

  if (!senderEmail) throw Error("Sender address for e-mail notifiations is not defined.");

  function getLink(type, hash) {
    return `${webappUrl}/login/${type}/${hash}`;
  }

  function sendEmail(email) {
    return app.service('emails').create(email).then(function (result) {
      console.log('Sent email', result)
    }).catch(err => {
      console.log('Error sending email', err)
    })
  }

  return {
    notifier: function (type, user, notifierOptions) {
      console.log(`-- Preparing email for ${type}`)
      var hashLink;
      var email;
      var emailAccountTemplatesPath = path.join(appRoot, 'email-templates', 'account');
      var templatePath;
      var compiledHTML;
      switch (type) {
        case 'resendVerifySignup': // send another email with link for verifying user's email addr

          hashLink = getLink('verify', user.verifyToken)

          templatePath = path.join(emailAccountTemplatesPath, 'verify-email.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: '',
            name: user.firstName || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: senderEmail,
            to: user.email,
            subject: 'Confirme seu e-mail',
            html: compiledHTML
          }

          return sendEmail(email)

          break
        case 'verifySignup': // inform that user's email is now confirmed

          hashLink = getLink('verify', user.verifyToken)

          templatePath = path.join(emailAccountTemplatesPath, 'email-verified.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: '',
            name: user.firstName || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: senderEmail,
            to: user.email,
            subject: 'Seu email foi confirmado, obrigado',
            html: compiledHTML
          }

          return sendEmail(email)

          break
        case 'sendResetPwd': // inform that user's email is now confirmed

          hashLink = getLink('reset', user.resetToken)

          templatePath = path.join(emailAccountTemplatesPath, 'reset-password.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: '',
            name: user.firstName || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: senderEmail,
            to: user.email,
            subject: 'Recupere sua senha',
            html: compiledHTML
          }

          return sendEmail(email)

          break
        case 'resetPwd': // inform that user's email is now confirmed

          hashLink = getLink('reset', user.resetToken)

          templatePath = path.join(emailAccountTemplatesPath, 'password-was-reset.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: '',
            name: user.firstName || user.email,
            hashLink,
            returnEmail
          })

          email = {
            from: senderEmail,
            to: user.email,
            subject: 'Sua senha foi redefinida',
            html: compiledHTML
          }

          return sendEmail(email)

          break
        case 'passwordChange':

          templatePath = path.join(emailAccountTemplatesPath, 'password-change.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: '',
            name: user.firstName || user.email,
            returnEmail
          })

          email = {
            from: senderEmail,
            to: user.email,
            subject: 'Sua senha foi alterada',
            html: compiledHTML
          }

          return sendEmail(email)

          break
        case 'identityChange':
          hashLink = getLink('verifyChanges', user.verifyToken)

          templatePath = path.join(emailAccountTemplatesPath, 'identity-change.pug')

          compiledHTML = pug.compileFile(templatePath)({
            logo: '',
            name: user.firstName || user.email,
            hashLink,
            returnEmail,
            changes: user.verifyChanges
          })

          email = {
            from: senderEmail,
            to: user.email,
            subject: 'Your account was changed. Please verify the changes',
            html: compiledHTML
          }

          return sendEmail(email)
          break
        default:
          break
      }
    }
  }
}
