'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const DataTypes = Sequelize.DataTypes;
    return queryInterface.createTable("cities", {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      stateId: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      isCapital: {
        type: DataTypes.BOOLEAN
      },
      point: {
        type: DataTypes.GEOMETRY('POINT', 4326)
      },
      withoutAccents: {
        type: DataTypes.STRING
      },
      alternativeNames: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      microregion: {
        type: DataTypes.STRING
      },
      mesoregion: {
        type: DataTypes.STRING
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('cities');
  }
};
