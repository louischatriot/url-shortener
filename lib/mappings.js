var Nedb = require('nedb')
  , urls = new Nedb({ filename: 'data/urls.nedb', autoload: true })
  ;

// Initialize urls database
urls.ensureIndex({ fieldName: 'from', unique: true });
urls.ensureIndex({ fieldName: 'to', unique: true });


/**
 * Show a page with all urls
 */
function showAllUrls (req, res) {
  urls.find({}, function (err, urlsList) {
    if (err) {
      // TODO
    }

    res.json(urlsList);
  });
}


/**
 * POST /urls
 * Create a new url
 */
function createUrl (req, res) {
  if (!req.body.from) { return res.status(400).json({ from: 'missing' }); }
  if (!req.body.to) { return res.status(400).json({ to: 'missing' }); }

  urls.insert({ from: req.body.from, to: req.body.to }, function (err) {
    if (err) {
      // TODO
    }

    return res.status(200).json({});
  });
}


/**
 * The actual redirection for all other urls
 */
function redirect (req, res) {
  if (!req.params.from) { req.params.from = ''; }

  urls.findOne({ from: req.params.from }, function (err, mapping) {
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
