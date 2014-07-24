
'use strict';

var async = require('async');

var AdminController = {};

// list all worlds
AdminController.worldList = function(req, res) {
	async.waterfall([
		function (next) {
			GateService.listWorld(next)
		},
	], function(err, worlds){
		if (err) return res.send(err, 500);
		if (worlds == null || !worlds.length) {
			res.json("no worlds");
		}else {
			res.json(worlds);
		}
	});
}

// create world
AdminController.worldCreate = function(req, res){
	var name = req.param('name');
	var port = parseInt(req.param('port'));
	var cap = parseInt(req.param('cap'));
	async.waterfall([
		function (next) {
			GateService.createWorld(name, port, cap, next)
		},
	], function(err, world){
		if (err) return res.send(err, 500);
		res.json(world);
	});
}


module.exports = AdminController;