var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , bodyParser = require('body-parser')
  , mappings = require('./lib/mappings')
  , config = require('./lib/config')
  , path = require('path')
  ;

// Initialize Express server
app.use(bodyParser.json());

// API
app.get('/api/mappings/list', mappings.showAllUrls);
app.post('/api/mappings', mappings.createUrl);

// Web interface
app.get('/create-mapping', function (req, res) { res.sendFile(path.join(process.cwd(), 'pages/create-mapping.html')); });

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
