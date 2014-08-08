
'use strict';

var BaseController = require('../libs/BaseController');

var GateController = BaseController.extend("GateController");
var self = GateController;

// user login
GateController.userLogin = function(req, res) {

	var username = req.param('username');
	var password = req.param('password');

	self.series({
		login: function(next){
			GateService.loginUser(username, password, next);
		},
		session: function(next, _data){
			SessionService.create(username, next);
		}
	}, function(err, _data){
		if (err) return res.pack(null, err); 
		res.pack(_data);
	});

};

// user create
GateController.userCreate = function(req, res) {

	var username = req.param('username');
	var phoneNumber = req.param('phoneNumber');
	var password = req.param('password');
	var rptpassword = req.param('rptpassword');

	self.waterfall([
		function(next){
			GateService.createUser(username, phoneNumber, password, rptpassword, next);
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
};

// weak account fast playing
GateController.userWeak = function(req, res) {

	self.waterfall([
		function(next){
			GateService.userWeak(next);
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
};

// list all worlds
GateController.worldList = function(req, res) {
	
	self.waterfall([
		function (next) {
			GateService.listWorld(next);
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
};

GateController.worldChoose = function(req, res) {
	var worldname = req.param('name');
	// could retrieve port number through request
	var port = _.parseInt(req.param('port'));
	var sid = req.sid;
	var username = req.gameUser.username;

	self.series({
		choose: function(next){
			GateService.chooseWorld(username, worldname, port, next);
		},
		session: function(next){
			SessionService.refresh(sid, username, worldname, next);
		},
	}, function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);		
	});

};

module.exports = GateController;
