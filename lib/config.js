var config = {}
  , env = process.env.LMURLSHORTENER || 'dev'
  ;

// Common options
config.serverPort = 2008;
config.authorizedLoggedDomain = '@getlocalmotion.com';   // The Google apps domain you want to use. Don't specify this if you want people to be able to log from any Gmail account


// Environment specific options
switch (env) {
  case 'prod':
    config.host = 'http://host.com';
    break;

  case 'dev':
  default:
    config.loginNotRequired = true;   // For testing only, flag to indicate auth is not required
    config.host = 'http://localhost:2008';
    break;
}

// Interface
module.exports = config;
