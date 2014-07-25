
'use strict';

var async = require('async');
var logger = require('../utils/LoggerUtils');

var AdminController = {};

// list all worlds
AdminController.worldList = function(req, res) {
	var gateService = new GateService(res);
	
	async.waterfall([
		function (next) {
			gateService.listWorld(next);
		},
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});
}

// create world
AdminController.worldCreate = function(req, res){
	var gateService = new GateService(res);

	var name = req.param('name');
	var port = parseInt(req.param('port'));
	var cap = parseInt(req.param('cap'));
	
	async.waterfall([
		function (next) {
			gateService.createWorld(name, port, cap, next)
		},
	], function(err, rslt){
		if (err) return res.send(err, 500);
		res.json(rslt);
	});
}


module.exports = AdminController;