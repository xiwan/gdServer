
var util = require('util');
var misc = require('../utils/MiscUtils');
var crypt = require('../utils/CryptUtils');
//var RedisUtils = require('../utils/RedisUtils');
var BaseService = require('./BaseService');

module.exports = SessionService;

function SessionService(res) {
	BaseService.apply(this, arguments);
	this.classname = "SessionService";
}

util.inherits(SessionService, BaseService);

SessionService.prototype.create = function(username, cb){
	var self = this;
	var sessionToken;
	var sessionid;

	async.waterfall([
		function(next){
			sessionToken = _build(username);
			next(null, sessionToken);
		},
		function(session, next) {
			crypt.md5(session, 'hex', next);
		},
		// update user sessionid;
		function(sid, next) {
			sessionid = sid;
			User.updateSid(username, sid, next);
		},
		// now we have to store the sessionId and sessionToken pair into redis/db
		// and the return the sessionId to the client side; {sid: xxxxxxx}
		function(user, next) {
			global.cache.set(sessionid, sessionToken, next);
		}
	], function(err, data) {
		if (err) {
				return cb(self.Error("USER_SESSION_SET_ERROR"));
		}
		self.rslt.data = {sid: sessionid};
		cb(null, self.rslt);
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