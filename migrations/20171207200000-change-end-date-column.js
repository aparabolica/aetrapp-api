"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE "traps" ALTER COLUMN "endDate" DROP NOT NULL;'
    );
  },

  down: function(queryInterface, Sequelize) {}
};
