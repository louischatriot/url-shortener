var config = {}
  , env = process.env.LMURLSHORTENER || 'dev'
  ;

// Common options
config.serverPort = 2008;


// Environment specific options
switch (env) {
  case 'prod':
    config.host = 'http://host.com';
    break;

  case 'dev':
  default:
    config.host = 'http://localhost:2008';
    break;
}

// Interface
module.exports = config;
