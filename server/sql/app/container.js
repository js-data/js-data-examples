// dependable is and IOC container library
// we register components with the container, and modules declare dependencies that they need injected
var dependable = require('dependable');
var path = require('path');

var container = dependable.container();

// Load and register app config
container.register('config', function () {
  return {
    PORT: process.env.PORT,

    // Rethinkdb configuration
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,

    // Login won't work without these
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

    // Default to using the js-data + angular example for the client.
    PUBLIC_PATH: process.env.PUBLIC_PATH
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

// Create and register a js-data-sql adapter with the container
container.register('sqlAdapter', function (config) {
  var DSSqlAdapter = require('js-data-sql');
  return new DSSqlAdapter({
    host: config.DB_HOST,
    port: config.DB_PORT,
    db: config.DB_DATABASE,
    min: 10,
    max: 50
  });
});

// For custom SQL queries, register the "query" object that comes from the adapter
container.register('query', function (sqlAdapter) {
  return sqlAdapter.query;
});

// Register the a new data store with the container
container.register('DS', function (container, sqlAdapter) {
  var JSData = require('js-data');
  var store = new JSData.DS({
    // Let's enable caching, which will greatly speed up reads and
    // because we're only running one instance of this app
    cacheResponse: true,
    bypassCache: false,

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
    log: false,

    // This hook will be used by all data store resources
    validate: function (resource, attrs, cb) {
      return cb(null, attrs);
    }
  });

  // Register the sql adapter as the default adapter
  store.registerAdapter('sql', sqlAdapter, {'default': true});

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
