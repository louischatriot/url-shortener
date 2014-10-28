var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  //, bodyParser = require('body-parser')
  , list = require('./lib/list')
  ;

//app.use(bodyParser.json());


app.get('/urls/list', list.showAllUrls);

app.post('/urls', list.createUrl);

// Serve static client-side js and css (should really be done through Nginx but at this scale we don't care)
app.get('/assets/*', function (req, res) {
  res.sendFile(process.cwd() + req.url);
});


// Last wall of defense against a bad crash
process.on('uncaughtException', function (err) {
  console.log('Caught an uncaught exception, I should probably send an email or something');
  console.log(err);
});


server.listen(2008);
