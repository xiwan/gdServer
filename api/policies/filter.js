'use strict';

var Class = require('../utils/ClassUtils');
var misc = require('../utils/MiscUtils');
var Code = require('../utils/CodeUtils');

//var util = require('util');


var Filter = new Class("Filter");

var self = Filter;

Filter.prepare = function (req, res, cb){
	req._time = misc.now();

	self.debug(req.method, req.url);
	if (!_.isEmpty(req.body)){
		self.debug("Body ", JSON.stringify(req.body));
	}

	var lang = req.param("lang");
	req.locale = (lang)?lang:'en';
	cb();
};

Filter.extendResponse = function(req, res, cb) {

	res.request = req;

	// bind function to req
	// Usage: 
	// 		1: pack(data)
	//		2: pack(data, code)
	//    3: pack(data, code, param1, param2, ...)
	res.pack = function(){
		var _data = _.toArray(arguments)[0];
		var _code = _.toArray(arguments)[1];
		var _params = _.toArray(arguments).slice(2);

		self.series([
			function(next){
				var _res = Code(res, _code, _params);
				if (!_.isEmpty(_data)){
					_res.data = _data;
				}

				if (_res.code == 400 || _res.code == 403 || _res.code == 404 
					|| _res.code == 500 || _res.code == 503) {
					res.send(_res, _res.code);
				} else {
					res.json(_res);
				}
				next(null, _res);
			},
			function(next){
				_afterLog(req, res, next);			
			},
			function(next){
				_afterDestroy(req, res, next);	
			},
		], function(err, _data){});

	};

	cb(null, res);
};

Filter.extendRequest = function(req, res, cb) {
	cb();
}

function _afterLog(req, res, cb){
	cb();	
};

function _afterDestroy(req, res, cb){
	req._time = misc.now() - req._time;
	self.debug(">>> time spent: " + req._time );

	req._time = null;
	req.sid = null;
	req.gameUser = null;
	req.v = null;

	res.request = null;
	res.pack = null;
	res.send = null;
	cb();
};

Filter.isAuthed = function(req, res, cb) {
	
	var sid = req.param('sid');
	async.waterfall([
		function(next){
			if (sid) {
        global.cache.hgetall(sid, next);
			}else {
				next("AUTH_NO_SID");
			}
		},
		function(sessionToken, next){
			if (!sessionToken){
				return next("AUTH_BAD_SID");
			}
			self.info(">>> session: ", sessionToken);
			var session = sessionToken.session;
			var _expire = sessionToken.expire; 

			var sessionArr = session.split(":");
			var len = sessionArr.length;
			var now = misc.now();

			var _world = null;
			var _username = null;
			var _now = null;

			if (len == 3) {
				// user in world
				_world = sessionArr[0];
				_username = sessionArr[1];
				_now = sessionArr[2];

			}else if (len == 2) {
				// user not in world
				_username = sessionArr[0];
				_now = sessionArr[1];

			}else {
				// abnormal condition;
				next("AUTH_BAD_SID");
			}

			if (now < _expire) {
				global.cache.hmset(sid, {"session": session, "expire": now + 7200}, function(err, result){
					next(null, _username, _world);
				});
			}else {
				// clean the expired sid
				global.cache.del(sid, function(err, _data){
					next("AUTH_EXPIRED_SID");
				});
			}

		},
		// could use cache here to quick gameUser;
		function(_username, _world, next){		
			User.getOneByUserAndWorld(_username, _world, next);
		},

	], function(err, user) {
		if (err) cb(err);
		if (!user) {
			return cb("AUTH_USER_NONE");
		}
		if (user.sid != sid) {
			return cb("AUTH_BAD_SID");
		}
		req.sid = sid;
		req.gameUser = user;
		cb();
	});

};


// if v < db v, then go to master data downloading logic
// if v = db v, nothing happend,
// if v > db v, degrade to db v or error happens
Filter.version = function (req, res, cb) {
	var _v = 0;
	async.waterfall([
		function(next){
			if (req.param && req.param('v')) {
		      _v = _.parseInt(req.param('v'));  
		      next(null, _v);
		  }else {
		  	next("MISS_VERSION");
		  }
		},
		function(_v, next){
		  if (global.v && global.v == _v) {
				self.info(">>> version get form cache");
				next(null, global.v);
			} else {
				Config.getOne("v", function(err, result) {
					self.info(">>> version get from db");
					global.v = _.parseInt(result.value);
					next(null, global.v);
				});
			}	
					
		},

	], function(err, v){
		if (v > _v) {
			return cb("CONFLICT_VERSION");
		}
		req.v = v;
		cb();
	});

};

Filter.isBanned = function(req, res, cb) {
	if (req.gameUser) {
		if (req.gameUser.banned){
			cb("USER_BANNED");
		}
	}else {
		cb("USER_NONE");
	}
	cb();
};

Filter.isUnderMaintenanceForAllUser = function (req, res, cb) {
	// here we retrieve world status
	var maintenance = {
		isUnderMaintenance: false,
	};
	if (maintenance.isUnderMaintenance) {
		cb("SERVICE_UNAVAILABLE");
	}else {
		cb();
	}
};

module.exports = Filter;

