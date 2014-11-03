var Nedb = require('nedb')
  , mappings = new Nedb({ filename: 'data/mappings.nedb', autoload: true })
  , url = require('url')
  ;

// Initialize mappings database
mappings.ensureIndex({ fieldName: 'from', unique: true });
mappings.ensureIndex({ fieldName: 'to', unique: true });


/**
 * Show a page with all mappings
 */
function showAllUrls (req, res) {
  mappings.find({}, function (err, mappingsList) {
    if (err) {
      // TODO
    }

    res.locals.mappings = mappingsList;
    return res.render('list.jade');
  });
}


/**
 * Normalize an url
 * Make sure it always has a protocol, use http:// if no protocol supplied
 */
function normalizeUrl (theUrl) {
  // This should work but doesn't due to a bug in the url library
  // see https://github.com/joyent/node/issues/6100
  //var urlObj = url.parse(theUrl);
  //if (!urlObj.protocol) {
    //urlObj.slashes = true;
    //urlObj.protocol = 'http';
  //}
  //return url.format(urlObj);

  // Using ugly hack instead
  if (theUrl.match(/^\/\//)) {
    theUrl = 'http:' + theUrl;    // Not respecting the user and using http protocol regardless, he should have used an absolute url anyway!
  }
  if (!theUrl.match(/^https?:\/\//)) {
    theUrl = 'http://' + theUrl;
  }
  return theUrl;
}


/**
 * POST /mappings
 * Create a new url
 */
function createUrl (req, res) {
  if (!req.body.from) { return res.status(400).json({ from: 'missing' }); }
  if (!req.body.to) { return res.status(400).json({ to: 'missing' }); }

  mappings.insert({ from: req.body.from, to: normalizeUrl(req.body.to) }, function (err) {
    if (err) {
      // TODO
    }

    return res.status(200).json({});
  });
}


/**
 * The actual redirection for all other mappings
 */
function redirect (req, res) {
  if (!req.params.from) { req.params.from = ''; }

  mappings.findOne({ from: req.params.from }, function (err, mapping) {
    if (err) {
      // TODO: better error handling
      return res.status(500).json({ message: 'Unexpected server error' });
    }

    if (!mapping) {
      // TODO: show a nice 404 instead
      return res.status(400).json({ from: 'missing' });
    }

    return res.redirect(302, mapping.to);
  });
}


// Interface
module.exports.showAllUrls = showAllUrls;
module.exports.createUrl = createUrl;
module.exports.redirect = redirect;
