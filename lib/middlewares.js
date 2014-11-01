

function mustBeLoggedIn (req, res, next) {
  console.log("======= MBL ");
  console.log(req.url);
  console.log(req.originalUrl);
  return next();
}

// Interface
module.exports.mustBeLoggedIn = mustBeLoggedIn;
