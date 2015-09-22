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
    DB_CLIENT: process.env.DB_CLIENT || 'mysql', // or "pg" or "sqlite3"
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_DATABASE: process.env.DB_DATABASE || 'jsdata',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',

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

// Create and register a js-data-sql adapter with the container
container.register('sqlAdapter', function (config) {
  var DSSqlAdapter = require('js-data-sql');
  return new DSSqlAdapter({
    client: config.DB_CLIENT,
    connection: {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_DATABASE,
      port: config.DB_PORT
    }
  });
});

// For custom SQL queries, register the "query" object that comes from the adapter
container.register('query', function (sqlAdapter) {
  return sqlAdapter.query;
});

// Automatically load and register the modules in these folders
container.load(path.join(__dirname, './controllers'));
container.load(path.join(__dirname, './middleware'));
container.load(path.join(__dirname, './models'));
container.load(path.join(__dirname, './lib'));

// Register the a new data store with the container
container.register('DS', function (Promise, container, sqlAdapter, messageService) {
  var JSData = require('js-data');
  JSData.DSUtils.Promise = Promise;
  var store = new JSData.DS({
    cacheResponse: false,
    bypassCache: true,

    // Important: If your relationships stop working, you might
    // have deleted this.
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
    log: false,

    beforeCreate: function (Resource, instance, cb) {
      instance.created_at = new Date();
      instance.updated_at = new Date();
      return cb(null, instance);
    },

    beforeUpdate: function (Resource, instance, cb) {
      instance.updated_at = new Date();
      return cb(null, instance);
    },

    afterCreate: function (Resource, instance, cb) {
      messageService.sendCreateMessage(Resource.name, instance);
      cb(null, instance);
    },

    afterUpdate: function (Resource, instance, cb) {
      messageService.sendUpdateMessage(Resource.name, instance);
      cb(null, instance);
    },

    afterDestroy: function (Resource, instance, cb) {
      messageService.sendDestroyMessage(Resource.name, instance);
      cb(null, instance);
    }
  });

  // Register the sql adapter as the default adapter
  store.registerAdapter('sql', sqlAdapter, {'default': true});

  return store;
});

// Register the container with the container, useful for when you need dynamically resolve a dependency or avoid a circular dependency
container.register('container', function () {
  return container;
});

module.exports = container;
