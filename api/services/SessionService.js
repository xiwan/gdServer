
var util = require('util');
var misc = require('../utils/MiscUtils');
var crypt = require('../utils/CryptUtils');
//var RedisUtils = require('../utils/RedisUtils');
var BaseService = require('./BaseService');

var SessionService = BaseService.extend("SessionService");
var self = SessionService;

SessionService.create = function(username, cb){

	var sessionToken;
	var sessionid;
	self.waterfall([
		function(next){
			sessionToken = _build(null, username);
			crypt.md5(sessionToken, 'hex', next);
		},
		// update user sessionid;
		function(sid, next) {
			sessionid = sid;
			User.updateSid(username, sid, next);
		},
		// now we have to store the sessionId and sessionToken pair into redis/db
		// and the return the sessionId to the client side; {sid: xxxxxxx}
		function(user, next) {
			var expire = misc.now() + 7200;
			global.cache.hmset(sessionid, {"session": sessionToken, "expire": expire}, next);
			//global.cache.hgetall(sessionid, next);
			//global.cache.set(sessionid, sessionToken, next);
		}
	], function(err, data) {
		if (err) {
				return cb("USER_SESSION_SET_ERROR");
		}
		cb(null, {sid: sessionid});
	});
}

SessionService.refresh = function(sid, username, worldname, cb){

	var sessionToken;
	var sessionid;
	self.waterfall([
		function(next){
			global.cache.hgetall(sid, next)
		},
		function(session, next){
			if (!session){
				next("AUTH_BAD_SID");
			}else{
				global.cache.del(sid, next);
			}
		},
		function(_data, next){
			if (_data == 1) {
				self.info(">>> delete key: ", sid);
			}
			sessionToken = _build(worldname, username);
			crypt.md5(sessionToken, 'hex', next);			
		},
		// update user sessionid;
		function(sid, next) {
			sessionid = sid;
			User.updateSid(username, sid, next);
		},
		// now we have to store the sessionId and sessionToken pair into redis/db
		// and the return the sessionId to the client side; {sid: xxxxxxx}
		function(user, next) {
			if (user) {
				var expire = misc.now() + 7200;
				global.cache.hmset(sessionid, {"session": sessionToken, "expire": expire}, next);
			}else {
				next("USER_SESSION_SET_ERROR");
			}
			//global.cache.hgetall(sessionid, next);
			//global.cache.set(sessionid, sessionToken, next);
		}
	], function(err, data){
		if (err) return cb(err);
		cb(null, {sid: sessionid});
	});


}

// if the user not login to world, the format is: val:now:expire;
// otherwise the format is: world:val:now
// every user/account can only have one session at the same moment;
function _build (val1, val2) {
	var now = misc.now();
	var expire = now + 7200;
	if (val1 && val2){
		return val1 + ":" + val2 + ":" + now;
	}

	if (val2){
		return val2 + ":" + now;
	}	
}

function _parse(sessionToken) {


}

module.exports = SessionService;