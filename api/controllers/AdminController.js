
'use strict';

var BaseController = require('./BaseController');

var AdminController = BaseController.extend("AdminController");
var self = AdminController;

// list all worlds
AdminController.worldList = function(req, res) {
	
	self.waterfall([
		function (next) {
			GateService.listWorld(next);
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
}

// create world
AdminController.worldCreate = function(req, res){

	var name = req.param('name');
	var port = parseInt(req.param('port'));
	var cap = parseInt(req.param('cap'));
	
	self.waterfall([
		function (next) {
			GateService.createWorld(name, port, cap, next)
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
}


module.exports = AdminController;