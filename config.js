// container for all environments
const environments = {};

// Development (default) environmnent
environments.dev = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'env': 'development',
  'db': '.data',
  'hashingSecret': 'thisIsASecret',
};

// Production environmnent
environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'env': 'production',
  'db': '.data',
  'hashingSecret': 'thisIsASecret',
};

// Determine which env was passed as a command line argument
const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env matches the defined environments
const exportedEnv = typeof(environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.dev;

module.exports = exportedEnv;
