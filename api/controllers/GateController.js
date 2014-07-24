
'use strict';

var async = require('async');
var code = require('../utils/CodeUtils');

var GateController = {};

// user login
GateController.userLogin = function(req, res) {
	var nickname = req.param('nickname');
	var password = req.param('password');

	async.waterfall([
		function(next){
			GateService.loginUser(res, nickname, password, next);
		},
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});
};

// user create
GateController.userCreate = function(req, res) {
	var nickname = req.param('nickname');
	var phoneNumber = req.param('phoneNumber');
	var password = req.param('password');
	var rptpassword = req.param('rptpassword');

	async.waterfall([
		function(next){
			GateService.createUser(res, nickname, phoneNumber, password, rptpassword, next);
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
	async.waterfall([
		function (next) {
			GateService.listWorld(next);
		},
	], function(err, worlds){
		if (err) return res.send(err, 500);
		if (worlds == null || !worlds.length) {
			res.json("no worlds");
		}else {
			res.json(worlds);
		}
	});
};

GateController.worldChoose = function(req, res) {

};

module.exports = GateController;
