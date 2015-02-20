var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github').Strategy;
var path = require('path');
var container = require('./container');

exports.createServer = function () {
  return container.resolve(function (safeCall, posts, comments, errorHandler, queryRewrite, passport, config) {
    var app = express();

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
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
          res.send(html);
        }
      });
    }

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete GitHub profile is serialized
    //   and deserialized.
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    /**
     * Use the GitHubStrategy within Passport.
     * Strategies in Passport require a `verify` function, which accept
     * credentials (in this case, an accessToken, refreshToken, and GitHub
     * profile), and invoke a callback with a user object.
     */
    passport.use(new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL
      },
      function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

          // To keep the example simple, the user's GitHub profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the GitHub account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
      }
    ));

    // middleware
    app.use(queryRewrite);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride());
    console.log(path.join(__dirname, config.PUBLIC));
    app.set('views', path.join(__dirname, config.PUBLIC));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
    app.use(session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, config.PUBLIC)));

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
      .get(safeCall(comments.findOneById))
      .put(ensureAuthenticated, safeCall(comments.updateOneById))
      .delete(ensureAuthenticated, safeCall(comments.deleteOneById));

    /*******************************/
    /********** posts **********/
    /*******************************/
    app.route('/api/posts')
      .get(safeCall(posts.findAll))
      .post(ensureAuthenticated, safeCall(posts.createOne));

    app.route('/api/posts/:id')
      .get(safeCall(posts.findOneById))
      .put(ensureAuthenticated, safeCall(posts.updateOneById))
      .delete(ensureAuthenticated, safeCall(posts.deleteOneById));

    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
      res.redirect('/');
    });
    app.post('/api/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });

    // redirect all others to the index (HTML5 history)
    app.get('*', renderIndex);

    app.use(function (err, req, res, next) {
      errorHandler(err, req, res, next);
    });

    return app;
  });
};

if (module === require.main || process.NODE_ENV === 'prod') {
  var app = exports.createServer();
  var server = http.createServer(app);
  var config = container.get('config');

  server.listen(config.PORT);

  var io = require('socket.io').listen(server);

  container.register('io', function () {
    return io;
  });
}
