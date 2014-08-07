
'use strict';

var BaseController = require('../libs/BaseController');

var config = {
	prefix: '/api/v2',
};

var AdminController = BaseController.extend("AdminController", config);
var self = AdminController;

AdminController.index = function(req, res) {
	//console.log(sails.router);

	self.waterfall([
		function (next) {
			GateService.listWorld(next);
		},
	], function(err, _data){
		if (err) return res.notFound();
		res.view('admin/index', {data:_data});
	});

};

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
};

// create world
AdminController.worldCreate = function(req, res){

	var name = req.param('name');
	var port = _.parseInt(req.param('port'));
	var cap = _.parseInt(req.param('cap'));
	
	self.waterfall([
		function (next) {
			GateService.createWorld(name, port, cap, next)
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
};

module.exports = AdminController;