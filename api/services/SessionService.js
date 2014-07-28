
var util = require('util');
var async = require('async');
var misc = require('../utils/MiscUtils');
var crypt = require('../utils/CryptUtils');
//var RedisUtils = require('../utils/RedisUtils');
var BaseService = require('./BaseService');

module.exports = SessionService;

function SessionService(res) {
	SessionService.super_.apply(this, arguments);
	this.classname = "SessionService";
}

util.inherits(SessionService, BaseService);

SessionService.prototype.create = function(username, cb){
	var self = this;
	var session =  _build(username);

	crypt.md5(session, 'hex', function(err, sessionid){
		self.rslt.data = {sid: sessionid};

		// now we have to store the sessionId and sessionToken pair into redis/db
		// and the return the sessionId to the client side; {sid: xxxxxxx}

			
		sails.config.redis.set(sessionid, session, function(err, result){
			if (err) {
				self.err(err);
			}
			self.debug("xxxxx", result);

			cb(null, self.rslt);
		});

	});
}

SessionService.prototype.refresh = function(){

}

// if the user not login to world, the format is: val:now:expire;
// otherwise the format is: world:val:now:expire
// every user/account can only have one session at the same moment;
function _build (val) {
	var now = misc.time();
	var expire = now + 3600;
	return val + ":" + now + ":" + expire;
}

function _parse(sessionToken) {


}