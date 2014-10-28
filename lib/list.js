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


// Interface
module.exports.showAllUrls = showAllUrls;
module.exports.createUrl = createUrl;
