'use strict';

var Class = require('../utils/ClassUtils');
var misc = require('../utils/MiscUtils');
var util = require('util');


module.exports = Filter;

function Filter(req, res){
	Filter.super_.apply(this, arguments);
	this.classname = "Filter";
	this.debug(req.method, req.url);
	if (!_.isEmpty(req.body)){
		this.debug("Body ", JSON.stringify(req.body));
	}
};

util.inherits(Filter, Class);

Filter.prototype.isAuthed = function(req, res, cb) {
	var self = this;
	var sid = req.param('sid');
	async.waterfall([
		function(next){
			if (sid) {
				try {
        	global.cache.get(sid, next);
        }catch(err) {
        	next(self.Error("AUTH_BAD_SID"))
        };
			}else {
				next(self.Error("AUTH_NO_SID"));
			}
		},
		function(session, next){
			if (!session){
				return next(self.Error("AUTH_BAD_SID"));
			}
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
				next(self.Error("AUTH_BAD_SID"));
			}
			if (now <= _now) {
				next(self.Error("AUTH_BAD_SID"));
			}else if (now < _expire) {
				// could use cache here to quick gameUser;
				User.getOneByUserAndWorld(_username, _world, next);
			}else {
				next(self.Error("AUTH_EXPIRED_SID"));
			}

		},
	], function(err, user) {
		if (err) cb(err);
		if (!user) {
			return cb(self.Error("AUTH_USER_NONE"));
		}
		if (user.sid != sid) {
			return cb(self.Error("AUTH_BAD_SID"));
		}
		req.gameUser = user;
		cb(null, req);
	});

};

Filter.prototype.lang = function (req, res, cb){
	var lang = req.param("lang");
	req.locale = (lang)?lang:'en';
	cb(null, req);
};

	// if v < db v, then go to master data downloading logic
	// if v = db v, nothing happend,
	// if v > db v, degrade to db v or error happens
Filter.prototype.version = function (req, res, cb) {
	var self = this;
	var _v = 0;
	async.waterfall([
		function(next){
			if (req.param && req.param('v')) {
		      _v = _.parseInt(req.param('v'));  
		  }
		  next(null, _v);
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
			return cb(self.Error("CONFLICT_VERSION"));
		}
		cb(null, req);
	});

};

Filter.prototype.isBanned = function(req, res, cb) {
	if (req.gameUser) {
		if (req.gameUser.banned){
			cb(self.Error("USER_BANNED"));
		}
	}else {
		cb(self.Error("USER_NONE"));
	}
	cb(null, req);
}

Filter.prototype.isUnderMaintenanceForAllUser = function (req, res, cb) {
	// here we retrieve world status
	var maintenance = {
		isUnderMaintenance: false,
	};
	if (maintenance.isUnderMaintenance) {
		cb(this.Error("SERVICE_UNAVAILABLE"), req);
	}else {
		cb(null, req);
	}
}

