'use strict';

var Class = require('../utils/ClassUtils');
var misc = require('../utils/MiscUtils');
var util = require('util');
var async = require('async');

module.exports = Filter;

function Filter(req, res){
	Filter.super_.apply(this, arguments);
	this.classname = "Filter";

	this.debug(req.method, req.url);
	this.debug("Body: ", req.body);

};

util.inherits(Filter, Class);

Filter.prototype.isAuthed = function(req, res, cb) {
	var self = this;
	var sid = req.param('sid');
	async.waterfall([
		function(next){
			if (sid) {
				try {
        	self.cache.get(sid, next);
        }catch(err) {
        	next(err)
        };
			}else {
				next(self.Error("AUTH_NO_SID"));
			}
		},
		function(session, next){
			self.debug(session);
			var sessionArr = session.split(":");
			var len = sessionArr.length;
			var now = misc.time();

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
			self.debug(_username, _world, now, _now, _expire);
			if (now <= _now) {
				next(self.Error("AUTH_BAD_SID"));
			}else if (now < _expire) {
				User.getOneByUserAndWorld(_username, _world, next);
			}else {
				next(self.Error("AUTH_EXPIRED_SID"));
			}

		},
	], function(err, user) {
		if (err) res.send(err, 500);
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
	if (lang) {
		req.locale = lang;
	}else {
		req.locale = 'en';
	}
	cb(null, req);
};

Filter.prototype.version = function (req, res, cb) {
	//logger.debug(req.param("v"));
	//todo: check request version
	// if v < db v, then go to master data downloading logic
	// if v = db v, nothing happend,
	// if v > db v, degrade to db v or error happens
	cb(null, req);
};

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

