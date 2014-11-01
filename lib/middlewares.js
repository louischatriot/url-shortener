var login = require('./login');

function mustBeLoggedIn (req, res, next) {
  if (!req.session.user) {
    return login.initialRequest(req, res);
  } else {
    return next();
  }
}

function addPageName (req, res, next) {
  res.locals[req.url.substring(1)] = true;
  return next();
}

// Interface
module.exports.mustBeLoggedIn = mustBeLoggedIn;
module.exports.addPageName = addPageName;
