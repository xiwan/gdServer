'use strict';

var Class = require('../utils/ClassUtils');
var misc = require('../utils/MiscUtils');
var code = require('../utils/CodeUtils');

//var util = require('util');


var Filter = new Class("Filter");

var self = Filter;

Filter.url = function(req, res) {

	self.debug(req.method, req.url);
	if (!_.isEmpty(req.body)){
		self.debug("Body ", JSON.stringify(req.body));
	}

};

Filter.extendResponse = function(req, res, cb) {


	// bind function to req
	// Usage: 
	// 		1: pack(data)
	//		2: pack(data, code)
	//    3: pack(data, code, param1, param2, ...)
	res.pack = function(){
		var _data = _.toArray(arguments)[0];
		var _code = _.toArray(arguments)[1];
		var _params = _.toArray(arguments).slice(2);

		var response = code(res, _code, _params);
		if (!_.isEmpty(_data)){
			response.data = _data;
		}

		if (response.code == 400 || response.code == 403 || response.code == 404 || response.code == 500) {
			return this.send(response, response.code);
		} 

		return this.json(response);
	};

	cb(null, res);
};


Filter.isAuthed = function(req, res, cb) {
	
	var sid = req.param('sid');
	async.waterfall([
		function(next){
			if (sid) {
				try {
        	global.cache.get(sid, next);
        }catch(err) {
        	next("AUTH_BAD_SID")
        };
			}else {
				next("AUTH_NO_SID");
			}
		},
		function(session, next){
			if (!session){
				return next("AUTH_BAD_SID");
			}
			self.info(">>> session: ", session);
			var sessionArr = session.split(":");
			var len = sessionArr.length;
			var now = misc.now();

			var _world = null;
			var _username = null;
			var _now = null;
			var _expire = null;

			if (len == 4) {
				// user in world
				_world = sessionArr[0];
				_username = sessionArr[1];
				_now = sessionArr[2];
				_expire = sessionArr[3];

			}else if (len == 3) {
				// user not in world
				_username = sessionArr[0];
				_now = sessionArr[1];
				_expire = sessionArr[2];

			}else {
				// abnormal condition;
				next("AUTH_BAD_SID");
			}

			if (now <= _now) {
				next("AUTH_BAD_SID");
			}else if (now < _expire) {
				// could use cache here to quick gameUser;
				User.getOneByUserAndWorld(_username, _world, next);
			}else {
				next("AUTH_EXPIRED_SID");
			}

		},
	], function(err, user) {
		if (err) cb(err);
		if (!user) {
			return cb("AUTH_USER_NONE");
		}
		if (user.sid != sid) {
			return cb("AUTH_BAD_SID");
		}
		req.gameUser = user;
		cb(null, req);
	});

};

Filter.lang = function (req, res, cb){
	var lang = req.param("lang");
	req.locale = (lang)?lang:'en';
	cb(null, req);
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
		cb(null, req);
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
	cb(null, req);
};

Filter.isUnderMaintenanceForAllUser = function (req, res, cb) {
	// here we retrieve world status
	var maintenance = {
		isUnderMaintenance: false,
	};
	if (maintenance.isUnderMaintenance) {
		cb("SERVICE_UNAVAILABLE");
	}else {
		cb(null, req);
	}
};

module.exports = Filter;

