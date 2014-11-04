var Nedb = require('nedb')
  , mappings = new Nedb({ filename: 'data/mappings.nedb', autoload: true })
  , utils = require('./utils')
  ;

// Initialize mappings database
mappings.ensureIndex({ fieldName: 'from', unique: true });


/**
 * WEB
 * Show all created mappings
 */
function showAllUrls (req, res) {
  mappings.find({}, function (err, mappingsList) {
    if (err) {
      // No need to do more for a noncritical such as this one
      // Could use some logging
      return res.json(500, { message: 'Unexpected error while retrieving mappingsList from database'
                           , error: err
                           })
    }

    res.locals.mappings = mappingsList;
    return res.render('list.jade');
  });
}

/**
 * WEB
 * Show a specific mapping
 * Parameter :from
 */
function viewMapping (req, res) {
  if (!req.params.from) {
    // Could use a nicer 400 page ...
    return res.json(400, { message: 'from parameter missing'
                         })
  }

  mappings.findOne({ from: req.params.from }, function (err, mapping) {
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    res.locals.mapping = mapping;
    return res.status(200).render('view.jade');
  });
}


/**
 * API
 * POST /mappings
 * Create a new mapping
 */
function createUrl (req, res) {
  if (!req.body.from) { return res.status(400).json({ from: 'missing' }); }
  if (!req.body.to) { return res.status(400).json({ to: 'missing' }); }

  mappings.insert({ from: req.body.from, to: utils.normalizeUrl(req.body.to), createAt: new Date(), clicks: 0 }, function (err) {
    if (err) {
      if (err.errorType === 'uniqueViolated') {
        return res.status(403).json({ messages: ['The mapping name is already taken'] });
      } else {
        return res.status(500).json({ messages: ['Unexpected server error'] });
      }
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
module.exports.viewMapping = viewMapping;
