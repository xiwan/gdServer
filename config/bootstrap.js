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

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  
  if (!globalInit()){
  	return;
  }

  var env = sails.config[sails.config.environment];
  if (env.redis) {
  	redisInit(env.redis);
  }else if (env.memcached) {
  	
  }else {
  	sails.log.warn("no cache found!");
  }
  cb();
};


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

    sails.log.info('redis is ready. ');
	});

}

