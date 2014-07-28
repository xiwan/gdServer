'use strict';


var async = require('async');
var Filter = require('./Filter');
var code = require('../Utils/CodeUtils');

module.exports = function(req, res, cb) {
	var filter = new Filter(req, res);

	async.waterfall([
		function(next){
			filter.isUnderMaintenanceForAllUser(req, res, next);
		},
		// master data version check
		function(underMaintenance, next) {
				filter.version(req, res, next);
		},
		// locale check, default set is 'en'
		function(data, next) {
			filter.lang(req, res, next);
		},

	], function(err, data){
		if (err) return cb(err);
		return cb();
	});
	
}