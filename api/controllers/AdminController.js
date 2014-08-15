
'use strict';

var BaseController = require('../libs/BaseController');

var AdminController = BaseController.extend("AdminController");
var self = AdminController;

// list all worlds
AdminController.index = function(req, res) {

	self.waterfall([
		function (next) {
			GateService.listWorld(next);
		},
	], function(err, _data){
		if (err) return res.notFound();
		res.view('admin/index', {data:_data, prefx: global.prefix});
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

// update world attribute
AdminController.worldSwitch = function(req, res) {
	var name = req.param('name');
	var port = _.parseInt(req.param('port'));
	var _switch = _.parseInt(req.param('switch'));
	self.debug(name, port, _switch);
	self.waterfall([
		function (next) {
			GateService.switchWorld(name, port, _switch, next);
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
			GateService.createWorld(name, port, cap, next);
		},
	], function(err, _data){
		if (err) return res.pack(null, err);
		res.pack(_data);
	});
};

module.exports = AdminController;