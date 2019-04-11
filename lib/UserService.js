const CrudService = require('./CrudService');
const { validateUserData } = require('../utils/validators');
const User = require('../models/User');
const { USERS } = require('../constants/data');
// const JwtService = require('./JwtService');

const ACCEPTABLE_METHODS = [
  'get',
  'put',
  'delete',
]

class UserService extends CrudService {
  constructor(dataService) {
    super(dataService, ACCEPTABLE_METHODS, USERS, true);
    // this.jwt = new JwtService();
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
    const validatedData = validateUserData(reqData);
    const { firstName, username, email, password } = validatedData;

    if (firstName || username || email || password) {
      const id = reqData.path.split('/')[1];

      this.dataService.read(this.entity, id, (err, data) => {
        if (!err && data) {
          const user = this._createNewUserData(validatedData,data);

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
          callback(500, { message: 'Error updating the file' });
        }
      });
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

  _createNewUserData (payload, currentUser) {
    const firstName = payload.firstName || currentUser.firstName;
    const username = payload.username || currentUser.username;
    const email = payload.email || currentUser.email;
    const password = payload.password || currentUser.password;

    return new User(
      firstName,
      username,
      email,
      password,
    );
  }
}

module.exports = UserService;
