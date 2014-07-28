/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var logger = require('../api/utils/LoggerUtils');

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var env = sails.config[sails.config.environment];
  if (env.redis) {
  	
  	//loadRedis(env.redis);
  }else if (env.memcached) {
  	
  }else {
  	logger.warn("no cache found!");
  }

  cb();
};


function loadRedis(config) {
	logger.info("start loading redis");

	var redis = require('redis');
	var client = null;
	try {
		client = redis.createClient(config.port, config.host);
	} catch (error) {
		logger.err(error);
	}
	console.log(client)
	if (client) {
		logger.info("finish loading redis");
	}
	
}

function loadMemcached(config) {

}