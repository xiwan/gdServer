
var util = require('util');
var redis = require('redis');
var Class = require('../libs/ExtendClass');


module.exports = RedisUtils;

function RedisUtils(port, host, options){
	RedisUtils.super_.apply(this, arguments);
	var self = this;
	self.classname = "RedisUtils";

	self.client = redis.createClient(port, host, options);
	//redis.debug_mode = true;

	self.client.on('ready', function(details){
		if(details)
			self.debug('ready: '+util.inspect(details));
	});

	self.client.on('connect', function(details){
		if(details)
			self.debug('connect: '+util.inspect(details));
	});

	self.client.on('error', function(details){
		if(details)
			self.err('error: '+util.inspect(details));
	});

	self.client.on('end', function(details){
		if(details)
			self.warn('end: '+util.inspect(details));
	});

	self.client.on('drain', function(details){
		if(details)
			self.debug('drain: '+util.inspect(details));
	});

	self.client.on('idle', function(details){
		if(details)
			self.debug('idle: '+util.inspect(details));
	});

}

util.inherits(RedisUtils, Class);

RedisUtils.prototype.checkIfRedisWorking = function(cb) {
	if (global == undefined || global.cache == undefined) {
		return cb("The cache object 'sails.config.cache' is not defined.");
	}

	// do a test set/get to verify redis is up.
  var key = 'redisTestKey';
  var val = 'redisTestVal';

  global.cache.set(key, val, function(err, result){
  	if (err) {
  		return cb("Error setting test value in Redis. Please make sure it's running.");
  	}

  	global.cache.get(key, function(err, result){
  		if (err || val !== result) {
         return cb("Error setting test value in Redis. Please make sure it's running.");
      }
      cb();  // success! Redis seems to be working
  	});

  });

};

