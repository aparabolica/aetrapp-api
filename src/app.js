const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const socketio = require('@feathersjs/socketio');

const handler = require('@feathersjs/express/errors');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');
const uploads = require('./uploads');

const sequelize = require('./sequelize');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folders
app.use('/files', express.static(path.join(__dirname, '/../uploads')));

// Host the public folder
app.use('/', express.static(app.get('public')));

app.configure(sequelize);
app.configure(rest());
app.configure(socketio({
  pingInterval: 10000,
  pingTimeout: 50000
}));
app.configure(middleware);
app.configure(authentication);
app.configure(uploads);
app.configure(services);
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;
