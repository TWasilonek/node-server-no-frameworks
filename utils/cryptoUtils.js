const crypto = require('crypto');
const config = require('../config');

// create a SHA256 hash
exports.hash = function (str) {
  if (typeof(str) === 'string' && str.length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
  } else {
    return false;
  }
};

exports.sign = function (str, key) {
  return crypto.createHmac('sha256', key).update(str).digest('base64');
}

exports.verify = function (raw, secret, signature) {
  return signature === this._sign(raw, secret);
}

exports.base64Encode = function (str) {
  return Buffer.from(str).toString('base64');
}

exports.base64Decode = function (str) {
  return Buffer.from(str, 'base64').toString();
}
