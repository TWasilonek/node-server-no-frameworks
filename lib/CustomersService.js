const CrudService = require('./CrudService');

class CustomersService extends CrudService {
  constructor(dataService, acceptableMethods) {
    super(dataService, acceptableMethods, 'customers');
  }
}

module.exports = CustomersService;
