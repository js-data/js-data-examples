// Change as necessary
module.exports = {
  // Port Express will listen to
  PORT: 3000,

  // Rethinkdb configuration
  DB_HOST: '127.0.0.1',
  DB_PORT: 28015,
  DB_DATABASE: 'jsdata',

  // Login won't work without these
  GITHUB_CLIENT_ID: '',
  GITHUB_CLIENT_SECRET: '',

  GITHUB_CALLBACK_URL: '',
};
