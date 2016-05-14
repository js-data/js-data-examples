'use strict'

const SqlAdapter = require('js-data-sql')
const nconf = require('nconf')

const adapter = exports.adapter = new SqlAdapter({
  client: 'mysql',
  host: nconf.get('DB_HOST'),
  port: nconf.get('DB_PORT'),
  db: nconf.get('DB')
})
