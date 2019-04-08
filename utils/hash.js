const crypto = require('crypto');
const config = require('../config');

// create a SHA256 hash
exports.hash = function (str) {
  if (typeof(str) === 'string' && str.length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret,).update(str).digest('hex');
  } else {
    return false;
  }
};
