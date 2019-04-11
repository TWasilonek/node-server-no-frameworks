const CrudService = require('./CrudService');
const { CUSTOMERS } = require('../constants/data');

class CustomersService extends CrudService {
  constructor(dataService, acceptableMethods) {
    super({
      dataService,
      acceptableMethods,
      entity: CUSTOMERS,
      requiresAuth: false,
    });
  }
}

module.exports = CustomersService;
