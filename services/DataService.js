const fs = require('fs');
const path = require('path');
const { parseJSONToObject, readFileAsync, readdirAsync } = require('../utils/dataUtils');

class DataService {
  constructor() {
    this.baseDir = path.join(__dirname, '/../.data');
  }

  create (dir, file, data, callback) {
    const filePath = this._makePath(dir, file);

    fs.open(filePath, 'wx', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        this._writeFile(fileDescriptor, stringData, callback);
      } else {
        callback('Could not create a new file, it may already exist');
      }
    });
  }

  read (dir, file, callback) {
    const filePath = this._makePath(dir, file);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err && data) {
        callback(err, parseJSONToObject(data));
      } else {
        callback(err, data);
      }
      
    });
  }

  update (dir, file, data, callback) {
    const filePath = this._makePath(dir, file);

    fs.open(filePath, 'r+', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        this._writeFile(fileDescriptor, stringData, callback);
      } else {
        callback('could not open the file for updating, it may not exist yet.');
      }
    });
  }

  delete (dir, file, callback) {
    const filePath = this._makePath(dir, file);

    fs.unlink(filePath, err => {
      if (!err) {
        callback(false);
      } else {
        callback('Error deleting the file');
      }
    })
  }

  readCollection (dir, callback) {
    const dirPath = path.join(this.baseDir, dir);

    readdirAsync(dirPath).then(filenames => {
      return Promise.all(filenames.map(file => this._getFile(dir, file)));
    }).then(files => {
      const collection = {};

      files.forEach(({ filename, data }) => {
        collection[filename] = parseJSONToObject(data);
      });

      callback(null, collection);
    }).catch((error) => {
      console.log('error ', error);
      callback('Error reading the directory');
    });
  }

  _getFile(dir, file) {
    const temp = file.split('.');
    temp.splice(-1, 1);
    const fileName = temp.join('.');
    const filePath = this._makePath(dir, fileName);
  
    return readFileAsync(filePath, 'utf8');
  }

  _writeFile (fileDescriptor, stringData, callback) {
    fs.writeFile(fileDescriptor, stringData, err => {
      if (!err) {
        fs.close(fileDescriptor, err => {
          if (!err) {
            callback(false);
          } else {
            callback('Error closing the file');
          }
        });
      } else {
        callback('Error writing to new file');
      }
    });
  }

  _makePath (dir, file) {
    return path.join(this.baseDir, dir, `${file}.json`);
  }
}

module.exports = DataService;
