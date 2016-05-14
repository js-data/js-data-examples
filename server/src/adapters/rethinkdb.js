'use strict'

const RethinkDBAdapter = require('js-data-rethinkdb')
const nconf = require('nconf')

const adapter = exports.adapter = new RethinkDBAdapter({
  host: nconf.get('DB_HOST') || 'localhost',
  port: nconf.get('DB_PORT') || 28015,
  db: nconf.get('DB') || 'blog'
})
