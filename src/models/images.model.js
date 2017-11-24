// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const shortid = require('shortid');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const images = sequelizeClient.define('cardImages', {
    // shortid https://www.npmjs.com/package/shortid
    id: {
      type: Sequelize.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },

    // properties
    caption: {
      type: Sequelize.TEXT
    },
    fileUrl: {
      type: Sequelize.STRING,
    },
    exifData: {
      type: Sequelize.JSON,
    },

    // relations
    trapId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    blobId: {
      type: Sequelize.STRING,
      allowNull: false
    },

    // analysis data
    processed: {
      type: Sequelize.BOOLEAN
    },

    processedAt: {
      type: Sequelize.DATE
    },

    eggCount: {
      type: Sequelize.INTEGER
    },

    // timestamps (no updates)
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  images.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return images;
};
