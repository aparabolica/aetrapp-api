const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/../uploads');

module.exports = function () {
  const app = this;
  app.use('/uploads', blobService({Model: blobStorage}));
};
