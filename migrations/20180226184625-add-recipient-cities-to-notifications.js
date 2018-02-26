'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('notifications', 'recipientCities', Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING)),
      queryInterface.addColumn('notifications', 'type', Sequelize.DataTypes.STRING),
      queryInterface.removeColumn('notifications', 'templateId'),
      queryInterface.removeColumn('notifications', 'locations'),
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('notifications', 'locations', Sequelize.DataTypes.JSON),
      queryInterface.addColumn('notifications', 'templateId', Sequelize.DataTypes.STRING),
      queryInterface.removeColumn('notifications', 'recipientCities'),
      queryInterface.removeColumn('notifications', 'type')
    ];
  }
};
