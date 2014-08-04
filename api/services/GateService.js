
var util = require('util');
var BaseService = require('./BaseService');


var GateService = BaseService.extend("GateService");
var self = GateService;

GateService.aplphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

GateService.createUser = function(req, username, phoneNumber, password, rptpassword, cb) {
	
	if (password != rptpassword) {
		return cb("PASSWORD_NOT_MATCHED");
	}

	this.waterfall([
		function (next){
			User.getOne(username, next);
		},
		function (user, next){
			if (user) {
				next("USER_DUPLICATE");
			}else{
				User.createOne(username, phoneNumber, password, next);
			}
		}
	], function(err, data){
		if(err) return cb(err);
		cb(null, data);
	});

};

GateService.loginUser = function(username, password, cb) {

	this.waterfall([
		function(next){
			User.getOneByUserAndPass(username, password, next);
		},
		function (user, next){
			if (user) {
				next(null, user);
			}else {
				next("USER_NONE");
			}
		},
	], function(err, data){
		if (err) return cb(err);
		cb(null, data);
	});

};

GateService.userWeak = function(cb) {
	this.waterfall([
		function(next){
			var randomName = '';
			for (var i=0; i<8; i++) {
				var idx = _.random(0, 61);
				randomName += this.aplphas.substr(idx, 1);
			}
			User.createOne(randomName, null, null, next);
		},
	], function(err, data){
		if (err) return cb(err);
		cb(null, data);
	});

};

GateService.listWorld = function(cb) {

	this.waterfall([
		function(next){
			World.getAll(next);
		},
	], function(err, worlds){
		if (err) return cb(err);
		if (!worlds || !worlds.length){
			return cb("WORLD_NONE");
		}
		cb(null, worlds);	
	});
};

GateService.createWorld = function(name, port, cap, cb) {

	var rslt = {};
	async.waterfall([
		function(next){
			World.getOne(port, next);
		}, 
		function(world, next) {
			if (world) {
				rslt = self.wrapCode("WORLD_DUPLICATE");
				next(null, world);
			}else {
				World.createOne(name, port, cap, next);
			}
		}
	], function(err, world){
		if(err) return cb(err);
		if (world) {
			rslt.data = world;
		}
		cb(null, rslt);
	});

};

module.exports = GateService;


