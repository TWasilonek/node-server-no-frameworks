const { validateUserData } = require('../utils/validators');
const User = require('../models/User');
const JwtService = require('./JwtService');
const { hash } = require('../utils/cryptoUtils');
const { USERS } = require('../constants/data');

class Auth {
  constructor(dataService) {
    this.acceptableRoutes = ['login', 'register'];
    this.dataService = dataService;
    this.handlers = {
      login: this.handleLogin.bind(this),
      register: this.handleRegister.bind(this),
    };
    this.jwt = new JwtService();
    this.entity = USERS;
  }

  processRequest (reqData, callback) {
    const route = reqData.path.split('/')[1];
    if (this.acceptableRoutes.indexOf(route) > -1) {
      this.handlers[route](reqData, callback);
    } else {
      callback(404, { 'Error:' : 'Resource not found' });
    }
  }

  handleRegister (reqData, callback) {
    const { firstName, username, email, password } = validateUserData(reqData);

    if (firstName && username && email && password) {
      // make sure that the user doesn't exis
      this.dataService.read(this.entity, username, (err, data) => {
        if (err) {
          // the user doesn't exist, create one
          const user = new User(firstName, username, email, password);
          this._registerUser(username, user, callback);
        } else {
          callback(400, { 'Error': `User with username: ${username} already exists` });
        }
      });
    } else {
      if (!username) {
        callback(400, { 'Error': 'Username must contain only english letters. No other characters are allowed.' })
      } else {
        callback(400, { 'Error': 'Missing required fields' });
      }
    }
  }

  handleLogin (reqData, callback) {
    const { password, username } = validateUserData(reqData);
    console.log(password, username);
    if (password && username) {
      this.dataService.read(this.entity, username, (err, data) => {
        if (!err && data) {
          const { password: hashedPassword } = data;
          console.log('hashed ', hashedPassword);
          console.log('sent ', hash(password));
          if (hash(password) === hashedPassword) {
            delete data.password;
            const token = this.jwt.createToken(data);

            callback(200, { data, token });
          } else {
            callback(401, {'Error': 'Not Authorized'});
          }
        } else {
          callback(500, { 'Error': 'Error while reading user' });
        }
      });
    } else {
      callback(401, { 'Error:' : 'Not Authorized' });
    }
  }

  _registerUser (id, data, callback) {
    this.dataService.create(this.entity, id, data, err => {
      if (!err) {
        delete data.password;
        let token = this.jwt.createToken(data);

        callback(200, { data, token });
      } else {
        callback(500, { message: err });
      }
    });
  }
}

module.exports = Auth;
