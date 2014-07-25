
var util = require('util');
var async = require('async');
var BaseService = require('./BaseService');
var logger = require('../utils/LoggerUtils');

module.exports = GateService;

function GateService(res) {
	GateService.super_.apply(this, arguments);
}

util.inherits(GateService, BaseService);

GateService.prototype.createUser = function(username, phoneNumber, password, rptpassword, cb) {
	var self = this;
	
	if (password != rptpassword) {
		self.rslt = self.wrapCode("PASSWORD_NOT_MATCHED");
		return cb(null, this.rslt);
	}

	async.waterfall([
		function (next){
			User.getOne(false, username, null, next);
		},
		function (user, next){
			if (user) {
				self.rslt = self.wrapCode("USER_DUPLICATE");
				next(null, user);
			}else{
				User.createOne(username, phoneNumber, password, next);
			}
		}
	], function(err, user){
		if(err) return cb(err);
		if (user) {
			self.rslt.data = user;
		}
		cb(null, self.rslt);
	});

};

GateService.prototype.loginUser = function(username, password, cb) {
	var self = this;

	async.waterfall([
		function(next){
			User.getOne(true, username, password, next);
		},
		function (user, next){
			if (user) {
				next(null, user);
			}else {
				self.rslt = self.wrapCode("USER_NONE");
				next(null, null);
			}
		},
	], function(err, user){
		if (err) return cb(err);
		if (user){
			self.rslt.data = user;
		}
		cb(null, self.rslt);
	});

};

GateService.prototype.listWorld = function(cb) {
	var self = this;

	async.waterfall([
		function(next){
			World.getAll(next);
		},
	], function(err, worlds){
		if (err) return cb(err);
		if (!worlds || !worlds.length){
			self.rslt = self.wrapCode("WORLD_NONE");
		}else {
			self.rslt.data = worlds;
		}
		cb(null, self.rslt);
	});
};


GateService.prototype.createWorld = function(name, port, cap, cb) {
	var self = this;

	async.waterfall([
		function(next){
			World.getOne(port, next);
		}, 
		function(world, next) {
			if (world) {
				self.rslt = self.wrapCode("WORLD_DUPLICATE");
				next(null, world);
			}else {
				World.createOne(name, port, cap, next);
			}
		}
	], function(err, world){
		if(err) return cb(err);
		if (world) {
			self.rslt.data = world;
		}
		cb(null, self.rslt);
	});
};