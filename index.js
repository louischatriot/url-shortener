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
  , api = express.Router()
  , login = require('./lib/login')
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
api.use(middlewares.apiMustBeLoggedIn);
api.post('/mappings', mappings.createUrl);
app.use('/api', api);


// Auth with Google
app.get('/login', login.initialRequest);
app.get('/googleauth', login.returnFromGoogle);
app.get('/logout', login.logout);


// Web interface
webapp.use(middlewares.mustBeLoggedIn);
webapp.use(middlewares.addCommonLocals);
webapp.get('/create', function (req, res) {
  res.render('create-mapping.jade');
});
webapp.get('/list', mappings.showAllMappings);
webapp.get('/view/:from', mappings.viewMapping);
app.use('/web', webapp);


// Root. Descriptive main page if not logged, main action (create a mapping) if logged
app.get('/', function (req, res) {
  if (req.session.user) {
    return res.redirect(302, '/web/create');
  } else {
    return res.render('main.jade');
  }
});


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
