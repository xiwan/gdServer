
'use strict';

var BaseController = require('./BaseController');

var GateController = BaseController.extend({});
GateController.classname = "GateController";

// user login
GateController.userLogin = function(req, res) {
	var gateService = new GateService(res);
	var sessionService = new SessionService(res);

	var username = req.param('username');
	var password = req.param('password');

	async.waterfall([
		function (next){
			gateService.loginUser(username, password, next);
		},
		function (rslt, next){
			if (sessionService.checkpoint(rslt)) {
				sessionService.create(username, next);
			}else {
				next(null, rslt)
			}
		}
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});

};

// user create
GateController.userCreate = function(req, res) {
	var gateService = new GateService(res);

	var username = req.param('username');
	var phoneNumber = req.param('phoneNumber');
	var password = req.param('password');
	var rptpassword = req.param('rptpassword');

	async.waterfall([
		function(next){
			gateService.createUser(username, phoneNumber, password, rptpassword, next);
		},
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});
};

// weak account fast playing
GateController.userWeak = function(req, res) {
	var gateService = new GateService(res);

	async.waterfall([
		function(next){
			gateService.userWeak(next);
		},
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});
};

// list all worlds
GateController.worldList = function(req, res) {
	var gateService = new GateService(res);
	
	async.waterfall([
		function (next) {
			gateService.listWorld(next);
		},
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});
};

GateController.worldChoose = function(req, res) {

};

module.exports = GateController;
