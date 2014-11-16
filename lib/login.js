var google = require('googleapis')
  , OAuth2 = google.auth.OAuth2
  , creds = require('../gauth')
  , url = require('url')
  , config = require('./config')
  , oauth2Client = new OAuth2( creds.clientId
                             , creds.clientSecret
                             , url.resolve(config.host, '/googleauth'))
  ;

google.options({ auth: oauth2Client });

function initialRequest (req, res) {
  var url = oauth2Client.generateAuthUrl({ scope: ['https://www.googleapis.com/auth/userinfo.email'] });
  req.session.gAuthReturnUrl = req.originalUrl === '/login' ? '/web/create' : req.originalUrl;
  return res.redirect(302, url);
}


function returnFromGoogle (req, res) {
  oauth2Client.getToken(req.query.code, function(err, tokens) {
    if(err) {
      res.locals.loginError = "Can't get credentials from Google servers";
      return res.render('main.jade');
    }

    oauth2Client.setCredentials(tokens);
    google.oauth2('v2').userinfo.get(function (err, response) {
      if (err) {
        res.locals.loginError = "Can't get credentials from Google servers";
        return res.render('main.jade');
      }

      if (!response.email || (config.authorizedLoggedDomain && !response.email.match(new RegExp(config.authorizedLoggedDomain + '$')))) {
        res.locals.loginError = "Can't login from non " + config.authorizedLoggedDomain + " accounts";
        return res.render('main.jade');
      }

      req.session.user = { name: response.name, email: response.email };
      var url = req.session.gAuthReturnUrl;
      delete req.session.gAuthReturnUrl;
      return res.redirect(302, url);
    });
  });
}


function logout (req, res) {
  delete req.session.user;
  return res.redirect(302, '/');
}


// Interface
module.exports.initialRequest = initialRequest;
module.exports.returnFromGoogle = returnFromGoogle;
module.exports.logout = logout;

