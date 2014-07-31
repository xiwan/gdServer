
var util = require('util');
var BaseService = require('./BaseService');
var logger = require('../utils/LoggerUtils');
//var log = require('../utils/LogUtils');

module.exports = GateService;

function GateService(res) {
	BaseService.apply(this, arguments);
	this.classname = "GateService";

	this.aplphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

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
			User.getOne(username, next);
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
			User.getOneByUserAndPass(username, password, next);
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

GateService.prototype.userWeak = function(cb) {
	var self = this;

	async.waterfall([
		function(next){
			var randomName = '';
			for (var i=0; i<8; i++) {
				var idx = _.random(0, 61);
				randomName += self.aplphas.substr(idx, 1);
			}
			next(null, randomName);
		},
		function(randomName, next){
			//self.createUser(randomName, null, '1111111', '111111', next);
			User.createOne(randomName, null, '12345678', next);
		}
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


