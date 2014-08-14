'use strict';

var fs = require('fs');
var beautify = require('js-beautify').js_beautify;
var defaults = require('./env/defaults');

module.exports.connections = (function(){
  var envConfigPath = defaults.config.paths.environments + '/' + defaults.environment + '.js';
  var database = {};

  if (fs.existsSync(envConfigPath)) {
    var database = require(envConfigPath).sys.database;
    // if (database[database.default] == null) {
    //   throw new Error(" Config structure is invalid");
    // }
  }else {
    console.log('Database config for ' + defaults.environment +' not found.');
  }

  var dbJsonFilePath = __dirname + "/env/json/" + process.env.NODE_ENV + ".json";

  // fs.writeFile(
  //   dbJsonFilePath, 
  //   beautify(JSON.stringify(database), { indent_size: 2 }), 
  //   function(err){
  //     if(err) throw err;
  //     console.log('>>> ', dbJsonFilePath);
  //   });
	//console.log(database);
  return database;
}());