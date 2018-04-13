'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("ALTER TABLE \"cities\" ALTER COLUMN \"eggCountAverage\" TYPE real USING \"eggCountAverage\"::integer;");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("ALTER TABLE \"cities\" ALTER COLUMN \"eggCountAverage\" TYPE integer USING \"eggCountAverage\"::real;");
  }
};
