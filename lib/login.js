var google = require('googleapis')
  , OAuth2 = google.auth.OAuth2
  , creds = require('../gauth')
  , oauth2Client = new OAuth2( creds.clientId
                             , creds.clientSecret
                             , 'http://localhost:2008/googleauth')
  ;

google.options({ auth: oauth2Client });

function initialRequest (req, res) {
  var url = oauth2Client.generateAuthUrl({ scope: ['https://www.googleapis.com/auth/userinfo.email'] });
  req.session.gAuthReturnUrl = req.originalUrl === '/login' ? '/web/create' : req.originalUrl;
  return res.redirect(302, url);
}


function returnFromGoogle (req, res) {
  // TODO: Handle errors
  oauth2Client.getToken(req.query.code, function(err, tokens) {
    if(!err) {
      oauth2Client.setCredentials(tokens);
      google.oauth2('v2').userinfo.get(function (err, response) {
        req.session.user = { name: response.name, email: response.email };
        var url = req.session.gAuthReturnUrl;
        delete req.session.gAuthReturnUrl;
        return res.redirect(302, url);
      });
    }
  });
}


function logout (req, res) {
  delete req.session.user;
  return res.json({ message: 'Log out successful' });   // TODO: create nice main page to redirect to upon logout
}


// Interface
module.exports.initialRequest = initialRequest;
module.exports.returnFromGoogle = returnFromGoogle;
module.exports.logout = logout;

