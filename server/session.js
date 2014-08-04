var session = require('express-session');
var config = require('nconf');
var sessConfig = config.get('session');
var storeName = sessConfig.store;
var Provider;

if (storeName === 'firebase') {
  Provider = require('connect-firebase')(session);
} else if (storeName === 'redis') {
  Provider = require('connect-redis')(session);
}

if (Provider) {
  sessConfig.store = new Provider(config.get(storeName));
} else {
  delete sessConfig.store;
}

module.exports = session(sessConfig);
