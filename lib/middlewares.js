

function mustBeLoggedIn (req, res, next) {
  // TODO: force log in with Google Apps
  console.log("======= MBL ");
  console.log(req.url);
  console.log(req.originalUrl);
  return next();
}

// Interface
module.exports.mustBeLoggedIn = mustBeLoggedIn;
