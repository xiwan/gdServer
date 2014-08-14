/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var redisUtils = require('../api/utils/RedisUtils');
var misc = require('../api/utils/MiscUtils');

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  if (!globalInit()){
  	return;
  }

  var sys = sails.config.sys;

  if (sys.redis) {
  	redisInit(sys.redis);
  }else if (sys.memcached) {
  	// no memcached
  }else {
  	sails.log.warn("no cache found!");
  }

  registerWorld(cb);
};

function registerWorld(cb){

  var nodeEnv = process.env.NODE_ENV;

  var _name = sails.config.sys.env.name;
  var _port = sails.config.sys.env.port;
  var _cap = sails.config.sys.env.cap;

  sails.config.sys.database.keys = _.keys(sails.config.sys.database);

  // admin site no need to register
  if (nodeEnv.indexOf('admin') > -1){ 
    return cb();
  }

  async.waterfall([
    function(next){
      World.getOne(null, _port, next);
    },
    function(world, next){
      if (world) {
          World.updateByPort({name: _name}, _port, next);
      }else {
        World.createOne(_name, _port, _cap, next);
      }
    }
  ], function (err, world) {
    if(err) return sails.log.error(err);
    cb();
  });
}


function globalInit(){
	if (!global){
      sails.log.warn('global object not be running!!!');
      return false;
	}
	return true;
}


function redisInit(config) {
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

    redis.warn('redis is ready. ');
	});
}


