// dependable is and IOC container library
// we register components with the container, and modules declare dependencies that they need injected
var dependable = require('dependable');
var path = require('path');

var container = dependable.container();

// Load and register app config
container.register('config', function () {
  return {
    PORT: process.env.PORT || 3000,

    // database configuration
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PORT: process.env.DB_PORT || 28015,
    DB_DATABASE: process.env.DB_DATABASE || 'jsdata',

    // Login won't work without these
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',

    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'http://127.0.0.1:3000/auth/github/callback',

    // Default to using the js-data + angular example for the client.
    PUBLIC_PATH: process.env.PUBLIC_PATH || '../../../client/angular'
  };
});

// 3rd-party dependencies
// Anything registered with the container becomes trivial to mock in tests
container.register('mout', function () {
  return require('mout');
});
container.register('Promise', function () {
  return require('bluebird');
});
container.register('passport', function () {
  return require('passport');
});

// Create and register a js-data-rethinkdb adapter with the container
container.register('rethinkdbAdapter', function (config) {
  var DSRethinkDbAdapter = require('js-data-rethinkdb');
  return new DSRethinkDbAdapter({
    host: config.DB_HOST,
    port: config.DB_PORT,
    db: config.DB_DATABASE,
    min: 10,
    max: 50
  });
});

// For custom RethinkDB queries, register the "r" object that comes from rethinkdbdash
container.register('r', function (rethinkdbAdapter) {
  return rethinkdbAdapter.r;
});

// Register the a new data store with the container
container.register('DS', function (container, rethinkdbAdapter) {
  var JSData = require('js-data');
  var store = new JSData.DS({
    cacheResponse: false,
    bypassCache: true,
    linkRelations: false,

    // Because
    upsert: false,

    // Don't really need this stuff on the server, so let's improve
    // performance and disable these features
    notify: false,
    keepChangeHistory: false,
    resetHistoryOnInject: false,

    // Here you could set "log" to a function of your own, for
    // debugging or to hook it into your own logging code.
    // You would the same with the "error" option.
    log: false
  });

  // Register the rethinkdb adapter as the default adapter
  store.registerAdapter('rethinkdb', rethinkdbAdapter, {'default': true});

  return store;
});

// Automatically load and register the modules in these folders
container.load(path.join(__dirname, './controllers'));
container.load(path.join(__dirname, './middleware'));
container.load(path.join(__dirname, './models'));
container.load(path.join(__dirname, './lib'));

// Register the container with the container, useful for when you need dynamically resolve a dependency or avoid a circular dependency
container.register('container', function () {
  return container;
});

module.exports = container;
