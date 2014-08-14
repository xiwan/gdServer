/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var fs = require('fs');
var async = require('async');
var beautify = require('js-beautify').js_beautify;
var redisUtils = require('../api/utils/RedisUtils');
var misc = require('../api/utils/MiscUtils');

module.exports.bootstrap = function (cb) {
  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var sys = sails.config.sys;

  async.series({
    envCheck: function(next) {
      if (!process.env.NODE_ENV) return next(' >>> no `NODE_ENV` !!!');
      next();
    },

    redisInit: function (next) {
      redisInit(sys.redis, next);
    },

    jsonOutput: function(next) {
      jsonOutput(sys.database, next);
    },

    worldRegist: function (next) {
      worldRegist(sys.env.name, sys.env.port, sys.env.cap, next);
    },


  }, function (err, data){
    if (err) return cb(err);
    sails.log.warn("bootstrap ok!");
    cb();
  });

};

function worldRegist(name, port, cap, cb){

  var nodeEnv = process.env.NODE_ENV;
  
  // admin site no need to register
  if (nodeEnv.indexOf('admin') > -1){ 
    return cb();
  }

  async.waterfall([
    function(next){
      World.getOne(null, port, next);
    },
    function(data, next){
      if (data) {
        World.updateByPort({name: name}, port, next);
      }else {
        World.createOne(name, port, cap, next);
      }
    }
  ], function (err, data) {
    cb(err);
  });
}

function jsonOutput(database, cb) {
  // store connenctions
  database.conns = _.keys(database);
  // output to json file  
  fs.writeFile(
    __dirname + "/env/jsons/" + process.env.NODE_ENV + ".json", 
    beautify(JSON.stringify(database), { indent_size: 2 }), 
    function(err){
      if(err) throw err;
      sails.log.warn('>>> ', process.env.NODE_ENV + ".json");
      cb();
    });
}

function redisInit(config, cb) {
	var redis = new redisUtils(config.port, config.host);

	// bind the client to global cache;
	global.cache = redis.client;
	// check if cache is working
	redis.checkIfRedisWorking(function(err){
		if (err) {
      return sails.log.warn(
      	'\n========================================================='+
        '\n========== redis may not be running!!! =================='+
        '\n=========================================================');
    }

    sails.log.warn('>>>  redis is ready. ');
    cb(err);
	});
}


