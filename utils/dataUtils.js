const fs = require('fs');

exports.parseJSONToObject = function (string) {
  try {
    const obj = JSON.parse(string);
    return obj;
  } catch(err) {
    return {};
  }
};

exports.readFileAsync = function (filePath, enc) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, enc, function(err, data){
      if (err) {
        reject(err); 
      } else {
        const pathParts = filePath.split('/');
        const filename = pathParts[pathParts.length - 1].split('.')[0];
        
        resolve({ filename, data });
      }
    });
  });
};

exports.readdirAsync = function (dirname) {
  return new Promise(function(resolve, reject) {
    fs.readdir(dirname, function(err, filenames){
      if (err) 
        reject(err); 
      else 
        resolve(filenames);
    });
  });
};
