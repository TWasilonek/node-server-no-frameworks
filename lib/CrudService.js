const { generateUUID } = require('../utils/uuid');
const { ACCEPTABLE_METHODS } = require('../constants/http');

class CrudService {
  // TODO: add authentication mechanism
  constructor(
    dataService,
    acceptableMethods = ACCEPTABLE_METHODS,
    entity = '',
  ) {
    this.dataService = dataService;
    this.acceptableMethods = acceptableMethods;
    this.entity = entity;
    this.handlers = {
      get: this.handleGet.bind(this),
      put: this.handleUpdate.bind(this),
      post: this.handleCreate.bind(this),
      delete: this.handleDelete.bind(this),
    };
  }

  processRequest (reqData, callback) {
    if (this.acceptableMethods.indexOf(reqData.method) > -1) {
      this.handlers[reqData.method](reqData, callback);
    } else {
      callback(405);
    }
  }
  
  handleGet (reqData, callback) {
    const id = reqData.path.split('/')[1];

    if (id) {
      this.handleGetEntity(id, reqData, callback); 
    } else {
      this.handleGetCollection(reqData, callback);
    }
  }
  
  handleGetCollection (reqData, callback) {
    this.dataService.readCollection(this.entity, (err, data) => {
      if (!err) {
        callback(200, { data: data });
      } else {
        callback(500, { message: err });
      }
    });
  }
  
  handleGetEntity (id, reqData, callback) {
    this.dataService.read(this.entity, id, (err, data) => {
      if (!err) {
        callback(200, { data: data });
      } else {
        callback(404, { message: 'Resource not found' });
      }
    });
  }
  
  handleUpdate (reqData, callback) {
    const id = reqData.path.split('/')[1];
  
    this.dataService.update(this.entity, id, reqData.payload, err => {
      if (!err) {
        callback(200, { data: reqData.payload });
      } else {
        callback(500, { message: err });
      }
    });
  }
  
  handleCreate (reqData, callback) {
    const id = generateUUID();
  
    this.dataService.create(this.entity, id, reqData.payload, err => {
      if (!err) {
        callback(200, { data: reqData.payload });
      } else {
        callback(500, { message: err });
      }
    });
  }
  
  handleDelete (reqData, callback) {
    const id = reqData.path.split('/')[1];
  
    this.dataService.delete(this.entity, id, err => {
      if (!err) {
        callback(200);
      } else {
        callback(404, { message: 'Resource not found' });
      }
    });
  }
}

module.exports = CrudService;
