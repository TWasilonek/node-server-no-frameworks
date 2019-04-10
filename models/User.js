const { hash } = require('../utils/cryptoUtils');

class User {
  constructor(
    firstName,
    username,
    email,
    password,
  ) {
    const hashedPassword = hash(password);

    this.firstName = firstName;
    this.username = username;
    this.password = hashedPassword;
    this.email = email;
  }
}

module.exports = User;