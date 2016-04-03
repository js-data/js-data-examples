'use strict'

require('source-map-support').install()
const Promise = require('bluebird')
const JSData = require('js-data')
const express = require('express')
const nconf = require('nconf')

// 1. Pull config from the commandline arguments
// 2. Pull config from environment variables
// 3. Pull config from a config file
nconf.argv().env().file({ file: `${__dirname}/../config.json` })

// Make JSData use bluebird internally
JSData.utils.Promise = Promise

const utils = require('./utils')
const middleware = require('./middleware')
const store = require('./store').store
const app = express()

const PAGE_SIZE = 5

// Application middleware
app.use(require('body-parser').json())
app.use(require('express-session')({ secret: 'keyboard cat' }))
app.use(middleware.passport.initialize())
app.use(middleware.passport.session())
app.use(express.static(`${__dirname}/../../client/public`))
app.use(middleware.queryRewrite)

// Application routes
app.get('/api/users/loggedInUser', function (req, res) {
  if (req.isAuthenticated()) {
    res.json(req.user)
  }
  res.end()
})

app.get('/api/posts', utils.makeSafe(function (req, res, next) {
  req.query.limit = req.query.limit === undefined ? PAGE_SIZE : req.query.limit
  req.query.offset = req.query.offset === undefined ? 0 : req.query.offset
  const currentPage = (req.query.offset / PAGE_SIZE) + 1

  Promise.all([
    store.count('post'),
    store.findAll('post', req.query)
  ]).spread(function (totalNumPosts, posts) {
    return {
      page: currentPage,
      data: posts,
      total: totalNumPosts
    }
  }).then(res.send.bind(res))
}))
app.post('/api/posts', utils.makeSafe(function (req, res, next) {
  return store.create('post', {
    title: req.body.title,
    content: req.body.content
  }).then(res.send.bind(res))
}))
app.get('/api/posts/:id', utils.makeSafe(function (req, res, next) {
  return store.find('post', req.params.id, { with: ['comment'] }).then(res.send.bind(res))
}))

app.get('/auth/github', middleware.passport.authenticate('github'))
app.get('/auth/github/callback', middleware.passport.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/')
})
app.post('/api/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// Serve index.html if no other route was matched
app.get('*', middleware.indexRoute)

// Generic catch-all error handler
app.use(middleware.errorHandler)

// Start the Express server
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', function () {
  const address = server.address().address
  const port = server.address().port
  console.log('App listening at http://%s:%s', address, port)
  console.log('Press Ctrl+C to quit.')
})
