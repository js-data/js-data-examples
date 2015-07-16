var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github').Strategy;
var path = require('path');
var container = require('./container');

// This allows us to programmatically start the app in a test environment
exports.createServer = function () {

  // Bootstrap the application, injecting a bunch of dependencies
  return container.resolve(function (User, safeCall, users, posts, comments, errorHandler, queryRewrite, passport, config) {
    var app = express();

    // Simple route middleware to ensure user is authenticated.
    // Use this route middleware on any resource that needs to be protected.  If
    // the request is authenticated (typically via a persistent login session),
    // the request will proceed.  Otherwise, the user will be redirected to the
    // login page.
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    }

    function renderIndex(req, res, next) {
      res.render('index.html', {}, function (err, html) {
        if (err) {
          next(err);
        } else {
          res.status(200).send(html).end();
        }
      });
    }

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    // Use the GitHubStrategy within Passport.
    // Strategies in Passport require a `verify` function, which accept
    // credentials (in this case, an accessToken, refreshToken, and GitHub
    // profile), and invoke a callback with a user object.
    passport.use(new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL
      },
      function (accessToken, refreshToken, profile, done) {
        User.findAll({
          github_id: profile.id
        }).then(function (users) {
          if (users.length) {
            return users[0];
          } else {
            return User.create({
              username: profile.username,
              avatar_url: profile._json.avatar_url,
              github_id: profile.id,
              name: profile.displayName,
              created_at: new Date()
            });
          }
        }).then(function (user) {
          return done(null, user);
        }).catch(function (err) {
          done(err);
        });
      }
    ));

    // middleware
    app.use(queryRewrite);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());

    // I'm only using Express to render/serve the index.html file and other static assets for simplicity with the example apps
    app.set('views', path.resolve(config.PUBLIC_PATH));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    // Using Express/Passports for simplicity in the example. I would never use this in production.
    app.use(session({secret: 'keyboard cat'}));
    app.use(passport.initialize());
    app.use(passport.session());
    // PUBLIC_PATH is used to choose with frontend client to use. Default is the js-data + Angular client.
    app.use(express.static(path.resolve(config.PUBLIC_PATH)));

    // app settings
    app.enable('trust proxy');

    app.get('/', renderIndex);

    /******************************/
    /********** comments **********/
    /******************************/
    app.route('/api/comments')
      // GET /comments
      .get(safeCall(comments.findAll))
      // POST /comments
      .post(ensureAuthenticated, safeCall(comments.createOne));

    app.route('/api/comments/:id')
      .put(ensureAuthenticated, safeCall(comments.updateOneById))
      .delete(ensureAuthenticated, safeCall(comments.deleteOneById));

    /*******************************/
    /********** posts **************/
    /*******************************/
    app.route('/api/posts')
      .get(safeCall(posts.findAll))
      .post(ensureAuthenticated, safeCall(posts.createOne));

    app.route('/api/posts/:id')
      .get(safeCall(posts.findOneById))
      .put(ensureAuthenticated, safeCall(posts.updateOneById))
      .delete(ensureAuthenticated, safeCall(posts.deleteOneById));

    /*******************************/
    /********** users **************/
    /*******************************/
    app.get('/api/users/loggedInUser', function (req, res) {
      if (req.isAuthenticated()) {
        return res.json(req.user);
      } else {
        res.send();
      }
    });

    app.route('/api/users')
      .get(safeCall(users.findAll));

    app.route('/api/users/:id')
      .get(safeCall(users.findOneById));

    // Normally I would have a bunch of user-related routes, but I'm
    // just using Passport.js + Github for simplicity in the example

    /*******************************/
    /*********** auth **************/
    /*******************************/
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login'}), function (req, res) {
      res.redirect('/');
    });
    app.post('/api/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
    app.post('/api/socket.io/', function (req, res, next) {
      next();
    });

    // Redirect all others to the index (HTML5 history)
    app.get('*', function (req, res, next) {
      if (req.originalUrl.indexOf('socket.io') === -1) {
        renderIndex(req, res, next);
      }
    });

    // Catch-all error handler
    app.use(function (err, req, res, next) {
      errorHandler(err, req, res, next);
    });

    return app;
  });
};

// This allows us to programmatically start the app in a test environment
if (module === require.main || process.env.NODE_ENV === 'prod') {
  var app = exports.createServer();
  var server = http.createServer(app);
  var config = container.get('config');

  server.listen(config.PORT);

  // Add a socket server to be used as a message bus for the clients
  var io = require('socket.io').listen(server);

  container.register('io', function () {
    return io;
  });

  var query = container.get('query');

  query.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return query.schema.createTable('users', function (t) {
        t.increments('id').primary();
        t.string('username');
        t.string('name');
        t.integer('github_id').unsigned();
        t.string('avatar_url');
        t.timestamps();
      });
    }
  }).then(function () {
    return query.schema.hasTable('posts');
  }).then(function (exists) {
    if (!exists) {
      return query.schema.createTable('posts', function (t) {
        t.increments('id').primary();
        t.integer('owner_id').unsigned().references('id').inTable('users');
        t.string('title');
        t.text('body');
        t.timestamps();
      });
    }
  }).then(function () {
    return query.schema.hasTable('comments');
  }).then(function (exists) {
    if (!exists) {
      return query.schema.createTable('comments', function (t) {
        t.increments('id').primary();
        t.integer('post_id').unsigned().references('id').inTable('posts');
        t.integer('owner_id').unsigned().references('id').inTable('users');
        t.text('body');
        t.timestamps();
      });
    }
  }).catch(function (err) {
    console.log(err);
  });
}
