
var util = require('util');
var BaseService = require('./BaseService');

var GateService = BaseService.extend("GateService");
var self = GateService;

self.aplphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

GateService.createUser = function(username, phoneNumber, password, rptpassword, cb) {
	if (password != rptpassword) {
		return cb("PASSWORD_NOT_MATCHED");
	}

	self.waterfall([
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

	self.waterfall([
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

	self.waterfall([
		function(next){
			var randomName = '';
			for (var i=0; i<8; i++) {
				var idx = _.random(0, 61);
				randomName += self.aplphas.substr(idx, 1);
			}
			User.createOne(randomName, null, null, next);
		},
	], function(err, data){
		if (err) return cb(err);
		cb(null, data);
	});

};

GateService.chooseWorld = function(username, worldname, port, cb){
	
	self.series({
		check: function(next){
			World.getOne(worldname, port, next);
		},
		choose: function(next, _data){
			if (_.isEmpty(_data.check)) {
				next("WORLD_NONE");
			}else {
				if(_data.check.population > _data.check.capacity){
					next("WORLD_POPULATION_BOOM");
				}else {
					_chooseWorld(username, worldname, port, next);
					//User.updateWorld(username, worldname, next);
				}
			}
		}

	}, function(err, _data){
		if (err) return cb(err);
		cb(null, _data);
	});
};

function _chooseWorld (username, worldname, port, cb){
	self.parallel({
		updateUser: function(next){
			User.updateWorld(username, worldname, next);
		},
		updateWorld: function(next) {
			World.updateByPort({popIncr: 1}, port, next);
		},
	}, cb);
};

GateService.listWorld = function(cb) {

	self.waterfall([
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
	self.waterfall([
		function(next){
			World.getOne(null, port, next);
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


