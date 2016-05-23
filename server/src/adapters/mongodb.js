'use strict'

const MongoDBAdapter = require('js-data-mongodb').MongoDBAdapter
const nconf = require('nconf')

const adapter = exports.adapter = new MongoDBAdapter()
