module.exports = {
  doResolver: require('./do-resolver'),
  sendVerificationEmail: require('./send-verification-email.js'),
  setFirstUserToRole: require('./set-first-user-to-role'),

  // traps
  updateUserTrapCount: require('./traps/update-user-trap-count'),
  setActiveTrapStatus: require('./traps/set-active-trap-status'),
  setCycleDates: require('./traps/set-cycle-dates'),

  // cities
  updateCityStatistics: require('./cities/update-city-statistics'),
}


