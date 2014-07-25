
'use strict';

var async = require('async');
var logger = require('../utils/LoggerUtils');

var GateController = {};

// user login
GateController.userLogin = function(req, res) {
	var gateService = new GateService(res);
	var sessionService = new SessionService(res);

	var username = req.param('username');
	var password = req.param('password');

	logger.debug("xxxx");

	async.waterfall([
		function (next){
			gateService.loginUser(username, password, next);
		},
		function (preRslt, next){
			sessionService.test(preRslt, next);
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

GateController.userWeak = function(req, res) {

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
