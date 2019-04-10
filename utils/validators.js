const { EMAIL_REGEX, LETTERS_REGEX } = require('../constants/regex.js');

const emailRegex = new RegExp(EMAIL_REGEX);
const usernameRegex = new RegExp(LETTERS_REGEX);

const validateString = value => typeof(value) === 'string' && value.trim().length > 0 ? value.trim() : false;

const validateEmail = value => emailRegex.test(value) ? value : false;

const validateUsername = value => usernameRegex.test(value) ? value : false;

exports.validateUserData = (data) => {
  const firstName = validateString(data.payload.firstName);
  const username = validateUsername(data.payload.username);
  const password = validateString(data.payload.password);
  const email = validateEmail(data.payload.email);

  return { 
    firstName,
    username,
    password,
    email,
  };
}