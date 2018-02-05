// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const shortid = require('shortid');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const cards = sequelizeClient.define('cards', {
    // shortid https://www.npmjs.com/package/shortid
    id: {
      type: DataTypes.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },

    // properties
    caption: {
      type: DataTypes.TEXT
    },
    fileUrl: {
      type: DataTypes.STRING,
    },
    exifData: {
      type: DataTypes.JSON,
    },

    // relations
    trapId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    blobId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.STRING
    },

    // analysis data
    status: {
      type: DataTypes.STRING,
      defaultValue: 'unprocessed'
    },
    jobId: {
      type: DataTypes.STRING
    },
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    error: {
      type: DataTypes.JSON
    },
    analysisStartedAt: {
      type: DataTypes.DATE
    },
    analysisFinishedAt: {
      type: DataTypes.DATE
    },


    processedAt: {
      type: DataTypes.DATE
    },

    eggCount: {
      type: DataTypes.INTEGER
    },

    // timestamps (no updates)
    collectedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  cards.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return cards;
};
