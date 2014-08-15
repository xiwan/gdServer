'use strict';

var fs = require('fs');
var defaults = require('./env/defaults');

module.exports.connections = (function(){
  var envConfigPath = defaults.config.paths.environments + '/' + defaults.environment + '.js';
  var database = {};

  if (fs.existsSync(envConfigPath)) {
    var database = require(envConfigPath).sys.database;
  }else {
    console.log('Database config for ' + defaults.environment +' not found.');
  }
 return database;
}());