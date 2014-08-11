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
var beautify = require('js-beautify').js_beautify;
var defaults = require('./env/defaults');

module.exports.adapters = (function(){
  var envConfigPath = defaults.config.paths.environments + '/' + defaults.environment + '.js';
  var database = {};

  if (fs.existsSync(envConfigPath)) {
    var database = require(envConfigPath).database;
    if (database[database.default] == null) {
      console.log("Config structure is invalid");
      throw new Error(" Config structure is invalid");
    }
  }else {
    console.log('Database config for ' + defaults.environment +' not found.');
  }

  var dbJsonFilePath = __dirname + "/env/json/" + process.env.NODE_ENV + ".json";
  fs.writeFile(
    dbJsonFilePath, 
    beautify(JSON.stringify(database), { indent_size: 2 }), 
    function(err){
      if(err) throw err;
      console.log('>>> ', dbJsonFilePath);
    });

  return database;
}());