/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */
'use strict';

var fs = require('fs');
var _ = require('lodash');
var logger = require('../api/utils/LoggerUtils');
var defaults = require('./env/defaults');

module.exports.adapters = (function(){
  var envConfigPath = defaults.config.paths.environments + '/' + defaults.environment + '.js';
  var database = {};

  if (fs.existsSync(envConfigPath)) {
    var database = require(envConfigPath).database;
    if (database[database.default] == null) {
      logger.err("Config structure is invalid");
      throw new Error(" Config structure is invalid");
    }
    logger.info('Loaded Database config for ' + defaults.environment + '.');
  }else {
    logger.info('Database config for ' + defaults.environment +' not found.');
  }
  return database;
}());

// module.exports.adapters = {

//   // If you leave the adapter config unspecified 
//   // in a model definition, 'default' will be used.
//   default: 'mongoDevelopment',

//   mongoDevelopment: {
//     module: 'sails-mongo',
//     user: 'gdConn',
//     password: '111111',
//     database: 'gdGame',
//     schema: true,
//     replSet: {
//       options: {
//           readPreference: 'secondary',
//       },
//       servers: [{
//           host: 'localhost',
//           port: 27017,
//       },
//       {
//           host: 'localhost',
//           port: 27018,
//       },
//       {
//           host: 'localhost',
//           port: 27019,
//       }]
//     },
//   },

//   // Persistent adapter for DEVELOPMENT ONLY
//   // (data is preserved when the server shuts down)
//   // disk: {
//   //   module: 'sails-disk'
//   // },

//   // MySQL is the world's most popular relational database.
//   // Learn more: http://en.wikipedia.org/wiki/MySQL
//   // myLocalMySQLDatabase: {

//   //   module: 'sails-mysql',
//   //   host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
//   //   user: 'YOUR_MYSQL_USER',
//   //   // Psst.. You can put your password in config/local.js instead
//   //   // so you don't inadvertently push it up if you're using version control
//   //   password: 'YOUR_MYSQL_PASSWORD', 
//   //   database: 'YOUR_MYSQL_DB'
//   // }
// };