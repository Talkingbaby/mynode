/*
 * Create and export configuration variables
 *
 */

//  container for all environments
let environments = {};

// staging environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
  };

// production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production'
  };

// determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current environment is one of the environments above, if not default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export module
module.exports = environmentToExport;