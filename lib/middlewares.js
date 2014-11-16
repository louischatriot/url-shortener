var login = require('./login')
  , config = require('./config')
  ;

// Log wall, if trying to access a webapp page while not logged, force logging
// Then display requested page
function mustBeLoggedIn (req, res, next) {
  // Deactivate log wall
  res.locals.username = 'TESTING';
  return next();

  if (!req.session.user) {
    return login.initialRequest(req, res);
  } else {
    res.locals.username = req.session.user.name || 'Unknown user';
    return next();
  }
}

// API log wall, simply send a 401 if call is not logged
function apiMustBeLoggedIn (req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ messages: ['You must be logged in'] });
  } else {
    return next();
  }
}

function addCommonLocals (req, res, next) {
  res.locals[req.url.substring(1)] = true;   // Add page name
  res.locals.host = config.host;
  return next();
}

// Interface
module.exports.mustBeLoggedIn = mustBeLoggedIn;
module.exports.apiMustBeLoggedIn = apiMustBeLoggedIn;
module.exports.addCommonLocals = addCommonLocals;
