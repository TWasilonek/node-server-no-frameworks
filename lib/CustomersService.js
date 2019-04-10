const CrudService = require('./CrudService');
const { CUSTOMERS } = require('../constants/data');

class CustomersService extends CrudService {
  constructor(dataService, acceptableMethods) {
    super(dataService, acceptableMethods, CUSTOMERS);
  }
}

module.exports = CustomersService;
