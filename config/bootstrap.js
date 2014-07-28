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
  var env = sails.config[sails.config.environment];
  if (env.redis) {
  	redisInit(env.redis);
  }else if (env.memcached) {
  	
  }else {
  	sails.log.warn("no cache found!");
  }
  cb();
};


function redisInit(config) {
	var redis = new redisUtils(config.port, config.host);
	sails.config.redis = redis.client;

	redis.checkIfRedisWorking(function(err){
		if (err) {
      return redis.warn(
      	'\n========================================================='+
        '\n========== redis may not be running!!! =================='+
        '\n=========================================================');
    }

    redis.info('redis is ready. ');
	});

}

