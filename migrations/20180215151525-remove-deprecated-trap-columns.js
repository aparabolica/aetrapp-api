'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('traps', 'collectionWeekday'),
      queryInterface.removeColumn('traps', 'notes'),
      queryInterface.removeColumn('traps', 'title'),
    ]
  },

  down: (queryInterface, Sequelize) => {
    const DataTypes = Sequelize.DataTypes;
    return [
      queryInterface.addColumn('traps', 'collectionWeekday', Sequelize.INTEGER),
      queryInterface.addColumn('traps', 'notes', DataTypes.TEXT),
      queryInterface.addColumn('traps', 'title', DataTypes.STRING),
    ]
  }
};
