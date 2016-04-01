'use strict'

// Container is mostly recommended for use in Node.js
const Container = require('js-data').Container
const Schema = require('js-data').Schema
const nconf = require('nconf')
const schemas = require('../../_shared/schemas')(Schema)
const relations = require('../../_shared/relations')
const adapterName = nconf.get('ADAPTER')

const adapter = exports.adapter = require('./adapters')(adapterName).adapter
const store = exports.store = new Container({
  mapperDefaults: {
    beforeCreate (props) {
      props.created_at = new Date()
      props.updated_at = new Date()
    },
    beforeUpdate (props) {
      props.updated_at = new Date()
    }
  }
})

store.registerAdapter(adapterName, adapter, { default: true })

// The Comment Resource
store.defineMapper('user', {
  // Our table names use plural form
  table: 'users',
  schema: schemas.user,
  relations: relations.user
})

// The Post Resource
store.defineMapper('post', {
  // Our table names use plural form
  table: 'posts',
  schema: schemas.post,
  relations: relations.post
})

// The Comment Resource
store.defineMapper('comment', {
  // Our table names use plural form
  table: 'comments',
  schema: schemas.comment,
  relations: relations.comment
})
