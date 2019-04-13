const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const DataService = require('./services/DataService');
const CustomersService = require('./services/CustomersService');
const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');
const { parseJSONToObject } = require('./utils/dataUtils');

class PingHandler {
  processRequest (reqData, callback) {
    callback(200);
  }
}
class NotFoundHandler {
  processRequest (reqData, callback) {
    callback(404);
  }
}

const dataService = new DataService();
const customersService = new CustomersService(dataService);
const userService = new UserService(dataService);
const authService = new AuthService(dataService);
const pingHandler = new PingHandler();
const notFoundHandler = new NotFoundHandler();

const db = config.db;
const router = {
  customers: customersService,
  users: userService,
  auth: authService,
  ping: pingHandler,
};

// ======= HTTP server ======= 
const httpServer = http.createServer(unifiedServer);

httpServer.listen(config.httpPort, () => {
  console.log(`Server is listening on ${config.httpPort} in ${config.env} environment`);
});

// ======= HTTPS server =======
const httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, 'https', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'https', 'cert.pem')),
};

const httpsServer = https.createServer(httpsServerOptions, unifiedServer);

httpsServer.listen(config.httpsPort, () => {
  console.log(`Server is listening on ${config.httpsPort} in ${config.env} environment`);
});

// ======= Unified Server ======= 
function unifiedServer (req, res) {
  // Parse the url
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the resource
  const resource = trimmedPath.split('/')[0];

  // Get the http method
  const method = req.method.toLowerCase();

  // Get the query string
  const queryStringObject = parsedUrl.query;

  // Get the headers
  const headers = req.headers;

  // Get the payload if there is any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const data = {
      path: trimmedPath,
      resource: resource,
      query: queryStringObject,
      method: method,
      headers: headers,
      payload: parseJSONToObject(buffer),
    };

    const routeHandler = typeof(router[resource]) !== 'undefined' ? router[resource] : notFoundHandler;

    // Route the status code called back by the handler, or default to 200
    routeHandler.processRequest(data, (statusCode, payload) => {
      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) === 'object'? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
}
