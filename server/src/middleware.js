'use strict'

const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const nconf = require('nconf')
const store = require('./store').store

passport.serializeUser(function (user, done) { done(null, user) })
passport.deserializeUser(function (obj, done) { done(null, obj) })
passport.use(new GitHubStrategy({
    clientID: nconf.get('GITHUB_CLIENT_ID'),
    clientSecret: nconf.get('GITHUB_CLIENT_SECRET'),
    callbackURL: nconf.get('GITHUB_CALLBACK_URL')
  }, function (accessToken, refreshToken, profile, done) {
    store.findAll('user', {
      github_id: profile.id
    }).then(function (users) {
      if (users.length) {
        return users[0]
      } else {
        return store.create('user', {
          username: profile.username,
          avatar_url: profile._json.avatar_url,
          github_id: profile.id,
          name: profile.displayName
        })
      }
    }).then(function (user) {
      return done(null, user)
    }).catch(done)
  }
))

exports.passport = passport

/**
 * TODO
 */
exports.indexRoute = function (req, res) {
  return res.sendFile('index.html', {
    root: `${__dirname}/../../client/public`
  })
}

/**
 * TODO
 */
exports.queryRewrite = function (req, res, next) {
  try {
    req.query.jsdataOptions || (req.query.jsdataOptions = {})
    if (req.query.with) {
      req.query.jsdataOptions.with = req.query.with
      req.query.with = undefined
    }
    if (req.query.where) {
      req.query.where = JSON.parse(req.query.where)
    }
    if (req.query.orderBy || req.query.sort) {
      const orderBy = req.query.orderBy || req.query.sort
      if (orderBy.length) {
        req.query.orderBy = orderBy.map(function (clause) {
          if (typeof clause === 'string') {
            return JSON.parse(clause)
          }
          return clause
        })
        req.query.sort = undefined
      }
    }
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * TODO
 */
exports.errorHandler = function (err, req, res, next) {
  let responder
  if (err && req) {
    if (res && next) {
      // Normally you would be using some logging library
      console.log(err)
    }
  }
  if (typeof req.send === 'function') {
    responder = req
  } else if (typeof res.send === 'function') {
    responder = res
  }
  if (err instanceof Error) {
    responder.status(500).send(err.message)
  } else if (typeof err === 'number') {
    responder.status(err)
  } else if (typeof err === 'object') {
    responder.status(400).send(err)
  } else {
    responder.status(500)
  }
  responder.end()
}
