const CrudService = require('./CrudService');
const { validateString, validateEmail, validateUsername } = require('../utils/validators');
const User = require('../models/User');

const USERS = 'users';

class UserService extends CrudService {
  constructor(dataService, acceptableMethods) {
    super(dataService, acceptableMethods, USERS);
  }

  handleCreate (reqData, callback) {
    const { firstName, username, email, password } = this._validateUserData(reqData);

    if (firstName && username && email && password) {
      // make sure that the user doesn't exis
      this.dataService.read(this.entity, username, (err, data) => {
        if (err) {
          // the user doesn't exist, create one
          const user = new User(firstName, username, email, password);
          this._createUser(username, user, callback);
        } else {
          callback(400, { 'Error': `User with username: ${username} already exists` });
        }
      });
    } else {
      if (!username) {
        callback(400, { 'Error': 'Username must contain only english letters. No other characters are allowed.' })
      }

      callback(400, { 'Error': 'Missing required fields' });
    }
  }

  handleGetCollection (reqData, callback) {
    this.dataService.readCollection(this.entity, (err, data) => {
      if (!err && data) {
        const cleanData = Object.keys(data).map((key) => {
          const user = { ...data[key] };
          delete user.password;

          return user;
        });
        
        callback(200, { data: cleanData });
      } else {
        callback(500, { message: err });
      }
    });
  }
  
  handleGetEntity (id, reqData, callback) {
    this.dataService.read(this.entity, id, (err, data) => {
      if (!err && data) {
        delete data.password;
        callback(200, { data: data });
      } else {
        callback(404, { message: 'User not found' });
      }
    });
  }

  handleUpdate (reqData, callback) {
    const { firstName, username, email, password } = this._validateUserData(reqData);

    if (firstName && username && email && password) {
      const id = reqData.path.split('/')[1];
      const user = new User(firstName, username, email, password);

      if (id !== username) {
        this.dataService.delete(this.entity, id, err => {
          if (!err) {
            this._createUser(username, user, callback);
          } else {
            callback(500, { message: 'Error updating the file' });
          }
        });
      } else {
        this._updateUser(id, user, callback);
      }
    } else {
      if (!username) {
        callback(400, { 'Error': 'Username must contain only english letters. No other characters are allowed.' })
      }

      callback(400, { 'Error': 'Missing required fields' });
    }
  }

  _createUser (id, data, callback) {
    this.dataService.create(this.entity, id, data, err => {
      if (!err) {
        delete data.password;
        callback(200, { data });
      } else {
        callback(500, { message: err });
      }
    });
  }

  _updateUser (id, data, callback) {
    this.dataService.update(this.entity, id, data, err => {
      if (!err) {
        delete data.password;
        callback(200, { data });
      } else {
        callback(500, { message: err });
      }
    });
  }

  _validateUserData (data) {
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
}

module.exports = UserService;
