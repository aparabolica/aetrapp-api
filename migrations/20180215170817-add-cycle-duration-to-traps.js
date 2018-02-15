'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    return [
      queryInterface.removeColumn('traps', 'daysToCollect'),
      queryInterface.addColumn('traps', 'cycleDuration', DataTypes.FLOAT)
    ]
  },

  down: (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    return [
      queryInterface.addColumn('traps', 'daysToCollect', DataTypes.INTEGER),
      queryInterface.removeColumn('traps', 'cycleDuration')
    ]
  }
};
