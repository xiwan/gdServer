'use strict';

var Class = require('./ExtendClass');
var misc = require('../utils/MiscUtils');
var Code = require('../utils/CodeUtils');
var Const = require('../Const');
var util = require('util');
var url = require('url');

var BaseFilter = new Class("Filter");
var self = BaseFilter;

BaseFilter.prepare = function (req, res, cb){
	self.debug(req.method, req.port, req.url);

	var lang = req.param("lang");
	req.locale = (lang)?lang:'en';
	req._time = misc.now();

	cb();
};

BaseFilter.extendResponse = function(req, res, cb) {

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

BaseFilter.extendRequest = function(req, res, cb) {
	cb();
}

function _afterLog(req, res, cb){
	req._time = misc.now() - req._time;
	self.debug(">>> time spent: " + req._time );
	cb();	
};

function _afterDestroy(req, res, cb){

	req._time = null;
	req.sid = null;
	req.gameUser = null;
	req.v = null;

	res.request = null;
	res.pack = null;
	res.send = null;
	cb();
};

BaseFilter.isAuthed = function(req, res, cb) {
	
	var sid = req.param('sid');
	self.waterfall([
		function (next){
			if (sid) {
        global.cache.hgetall(sid, next);
			}else {
				next("AUTH_NO_SID");
			}
		},
		function (sessionToken, next){

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
		function (_username, _world, next){		
			User.getOneByUserAndWorld(_username, _world, next);
		},

		function (user, next) {
			if (!user) {
				return next("AUTH_USER_NONE");
			}
			if (user.sid != sid) {
				return next("AUTH_BAD_SID");
			}
			// todo: filter out request coming from admin site;
			Config.getOne("maintenance", function(err, result) {
				if (_.parseInt(result.value)) {
					if (!_isMaintenanceUser(user)){
						next("SERVICE_UNAVAILABLE");
					}
				}else {
					next(null, user);
				}	
			});
		},
	], function(err, user) {
		if (err) return cb(err);
		req.sid = sid;
		req.gameUser = user;
		cb();
	});

};

function _isMaintenanceUser (user) {
	var users= sails.config[process.env.NODE_ENV].maintenance.users;
  for (var i = 0; i < users.length; i++) {
      if (user.username === users[i])
          return true;
  }
  return false;
};


// if v < db v, then go to master data downloading logic
// if v = db v, nothing happend,
// if v > db v, degrade to db v or error happens
BaseFilter.isValidVersion = function (req, res, cb) {
	var _v = 0;
	self.waterfall([
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


BaseFilter.isSwitchedOn = function(req, res, cb) {
	var port = _.parseInt(req.port);

	// need to investigate why hgetall and hmset doesnt work out any more.
	self.series({
		queryCache: function (next) {
			global.cache.get(Const.cache.worlds, next);
		},
		queryDb: function (next, _data) {
			if (_data.queryCache){
				return next(null, _data.queryCache);
			}

			World.getAll(function (err, result){
				var _result = JSON.stringify(result);
				global.cache.set(Const.cache.worlds, _result, function(){
					next(null, _result);
				});
			});

		},
		querySwitch: function(next, _data) {
			var worlds = JSON.parse(_data.queryDb);
			for (var i=0, len=worlds.length; i<len; i++) {
				if (worlds[i].port == port) {
					return next(null, worlds[i]['switch']);
					break;
				}
			}
			next();
		}
	}, function(err, _data){
		if (err) return cb(err);

		switch (_data.querySwitch) {
			// if switch == 0, welcome all;
			case 0: cb(); break;
			// if switch == 1, block newbies to current world, no effect on players;
			case 1: 
				if (req.gameUser.onMission){
					cb();
				} else {
					if (req.gameUser.characters){
						cb();
					}else {
						cb("SERVICE_UNAVAILABLE");
					}
				}
			break;
			// if switch == 2, block current world's entrance, no effect on players;
			case 2: 
				if (req.gameUser.onMission){
					cb();
				} else {
					cb("SERVICE_UNAVAILABLE");
				}
			break;
			// if switch == 3, disabled current world, effect every one;
			case 3: cb("SERVICE_UNAVAILABLE"); break;
			default: cb("SERVICE_UNAVAILABLE"); break;
		}
		
	});
};

BaseFilter.isBanned = function(req, res, cb) {
	if (req.gameUser.banned){
		return cb("USER_BANNED");
	}
	cb();
};

BaseFilter.isUnderMaintenanceForAllUser = function (req, res, cb) {
	// todo: filter out request coming from admin site;
	Config.getOne("maintenance", function(err, result) {
		if (result && _.parseInt(result.value)) {
			return cb("SERVICE_UNAVAILABLE");
		}
		cb();	
	});
};


module.exports = BaseFilter;

