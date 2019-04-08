const { EMAIL_REGEX, LETTERS_REGEX } = require('../constants/regex.js');

const emailRegex = new RegExp(EMAIL_REGEX);
const usernameRegex = new RegExp(LETTERS_REGEX);

exports.validateString = value => typeof(value) === 'string' && value.trim().length > 0 ? value.trim() : false;

exports.validateEmail = value => emailRegex.test(value) ? value : false;

exports.validateUsername = value => usernameRegex.test(value) ? value : false;