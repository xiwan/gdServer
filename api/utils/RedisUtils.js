
var util = require('util');
var redis = require('redis');
var Class = require('./ClassUtils');


module.exports = RedisUtils;

function RedisUtils(port, host, options){
	RedisUtils.super_.apply(this, arguments);
	var self = this;
	self.classname = "RedisUtils";

	self.client = redis.createClient(port, host, options);

	self.client.on('ready', function(details){
		self.debug('ready: '+util.inspect(details));
	});

	self.client.on('connect', function(details){
		self.debug('connect: '+util.inspect(details));
	});

	self.client.on('error', function(details){
		self.err('error: '+util.inspect(details));
	});

	self.client.on('end', function(details){
		self.warn('end: '+util.inspect(details));
	});

	self.client.on('drain', function(details){
		self.debug('drain: '+util.inspect(details));
	});

	self.client.on('idle', function(details){
		self.debug('idle: '+util.inspect(details));
	});

}

util.inherits(RedisUtils, Class);

RedisUtils.prototype.checkIfRedisWorking = function(cb) {
	if (sails.config == undefined || sails.config.redis == undefined) {
		return cb("The cache object 'sails.config.redis' is not defined.");
	}

	// do a test set/get to verify memcached is up.
  var key = 'sailsTestKey';
  var val = 'sailsTestVal';

  sails.config.redis.set(key, val, function(err, result){
  	if (err) {
  		return cb("Error setting test value in Redis. Please make sure it's running.");
  	}

  	sails.config.redis.get(key, function(err, result){
  		if (err || val !== result) {
         return cb("Error setting test value in Redis. Please make sure it's running.");
      }
      cb();  // success! Redis seems to be working
  	});

  });

};

