'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const DataTypes = Sequelize.DataTypes;
    return queryInterface.createTable("traps", {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      userOrder: {
        type: DataTypes.INTEGER
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      statusCode: {
        type: DataTypes.INTEGER
      },
      statusMessage: {
        type: DataTypes.TEXT
      },
      daysToCollect: DataTypes.INTEGER,
      title: {
        type: DataTypes.STRING
      },
      notes: {
        type: DataTypes.TEXT
      },

      imageId: {
        type: DataTypes.STRING
      },

      // location
      coordinates: {
        type: DataTypes.GEOMETRY("POINT", 4326)
      },
      addressStreet: {
        type: DataTypes.STRING
      },
      addressNumber: {
        type: DataTypes.STRING
      },
      addressComplement: {
        type: DataTypes.STRING
      },
      addressNeighborhood: {
        type: DataTypes.STRING
      },
      addressPostcode: {
        type: DataTypes.STRING
      },
      addressCityId: {
        type: DataTypes.STRING
      },
      addressStateId: {
        type: DataTypes.STRING
      },

      // relations
      ownerId: {
        type: DataTypes.STRING
      },

      // timestamps
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('traps');
  }
};
