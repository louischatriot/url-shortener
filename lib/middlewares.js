

function mustBeLoggedIn (req, res, next) {
  // TODO: force log in with Google Apps
  console.log("======= MBL ");
  console.log(req.url);
  console.log(req.originalUrl);
  return next();
}

function addPageName (req, res, next) {
  res.locals[req.url.substring(1)] = true;
  return next();
}

// Interface
module.exports.mustBeLoggedIn = mustBeLoggedIn;
module.exports.addPageName = addPageName;
