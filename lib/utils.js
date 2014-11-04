var url = require('url');


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


// Interface
module.exports.normalizeUrl = normalizeUrl;
