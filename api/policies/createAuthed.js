'use strict';

var async = require('async');
var Filter = require('./Filter');

module.exports = function(req, res, cb) {
	var filter = new Filter(req, res);

	async.waterfall([
		function(next){
			filter.isUnderMaintenanceForAllUser(req, res, next);
		},
		// locale check, default set is 'en'
		function(data, next) {
			filter.lang(req, res, next);
		},

		// is authed user ?
		function(underMaintenance, next) {
				filter.isAuthed(req, res, next);
		},
	], function(err, data){
		if (err) return cb(err);
		cb();
	});
	
}