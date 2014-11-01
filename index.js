var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , bodyParser = require('body-parser')
  , mappings = require('./lib/mappings')
  , config = require('./lib/config')
  , path = require('path')
  , middlewares = require('./lib/middlewares')
  , webapp = express.Router()
  ;

// Initialize Express server and Express Group Handlers
app.use(bodyParser.json());


// API
app.get('/api/mappings/list', mappings.showAllUrls);
app.post('/api/mappings', mappings.createUrl);

// Web interface
webapp.use(middlewares.mustBeLoggedIn);
webapp.get('/create-mapping', function (req, res) {
  res.render('create-mapping.jade', { youAreUsingJade: true });
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
