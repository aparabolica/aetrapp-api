module.exports = {
  doResolver: require('./do-resolver'),
  sendVerificationEmail: require('./send-verification-email.js'),
  setFirstUserToRole: require('./set-first-user-to-role'),

  // traps
  updateUserTrapCount: require('./traps/update-user-trap-count'),
  // cities
  updateCityStatistics: require('./cities/update-city-statistics'),
}


