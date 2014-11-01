var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , bodyParser = require('body-parser')
  , mappings = require('./lib/mappings')
  , config = require('./lib/config')
  , path = require('path')
  , session = require('express-session')
  , middlewares = require('./lib/middlewares')
  , webapp = express.Router()
  , google = require('googleapis')
  , OAuth2 = google.auth.OAuth2
  , creds = require('./gauth')
  ;

// Initialize Express server and session
// Right now the session store is a simple in memory key value store and gets erased
// on restart. If needed I'll create a Nedb-backed one
app.use(bodyParser.json());
app.use(session({ secret: 'eropcwnjdi'
                , resave: true
                , saveUninitialized: true
                }));


// API
app.get('/api/mappings/list', mappings.showAllUrls);
app.post('/api/mappings', mappings.createUrl);

// Auth with Google
app.get('/login', function (req, res, next) {
  var oauth2Client = new OAuth2( creds.clientId
                               , creds.clientSecret
                               , 'http://localhost:2008/googleauth');

});


app.get('/googleauth', function (req, res, next) {
  console.log('--------------------');
  console.log(req.query);
  return res.json({ yeah: 'done' });
});


// Web interface
webapp.use(middlewares.mustBeLoggedIn);
webapp.use(middlewares.addPageName);
webapp.get('/create', function (req, res) {
  res.render('create-mapping.jade', { youAreUsingJade: true });
});
webapp.get('/list', function (req, res) {
  res.render('list.jade', { youAreUsingJade: true });
});
app.use('/web', webapp);

// Serve static client-side js and css (should really be done through Nginx but at this scale we don't care)
app.get('/assets/*', function (req, res) {
  res.sendFile(process.cwd() + req.url);
});

// Actual redirections
app.get('/:from', mappings.redirect);

// Last wall of defense against a bad crash
process.on('uncaughtException', function (err) {
  console.log('Caught an uncaught exception, I should probably send an email or something');
  console.log(err);
});


server.listen(config.serverPort);
