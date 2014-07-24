var async = require('async');
var code = require('../utils/CodeUtils');

// To Do: Make a general Service
var GateService = {};

GateService.createUser = function (res, nickname, phoneNumber, password, rptpassword, cb) {
	var rslt = code(res);
	if (password != rptpassword) {
		rslt = code(res, code.PASSWORD_NOT_MATCHED_2, [password, rptpassword]);
		cb(null, rslt);
		return;
	}
	async.waterfall([
		function (next){
			User.getOne(false, nickname, phoneNumber, next);
		},
		function (user, next){
			if (user) {
				rslt = code(res, code.USER_DUPLICATE);
				next(null, user);
			}else{
				User.createOne(nickname, phoneNumber, password, next);
			}
		}
	], function(err, user){
		if(err) return cb(err);
		rslt.data = user;
		cb(null, rslt);
	});
};

GateService.loginUser = function(res, nickname, password, cb) {
	var rslt = code(res);
	async.waterfall([
		function(next){
			User.getOne(true, nickname, password, next);
		},
		function (user, next){
			if (user) {
				next(null, user);
			}else {
				rslt = code(res, code.USER_NONE);
				next(null, null);
			}
		},
	], function(err, user){
		if(err) return cb(err);
		rslt.data = user;
		cb(null, rslt);
	});
};

GateService.listWorld = function(cb) {
	async.waterfall([
		function(next){
			World.getAll(next);
		},
	], cb);
};


GateService.createWorld = function(name, port, cap, cb) {
	async.waterfall([
		function(next){
			World.getOne(port, next);
		}, 
		function(world, next) {
			if (world) {
				next(null, world);
			}else {
				World.createOne(name, port, cap, next);
			}
		}
	], cb);
}

module.exports = GateService;