'use strict';

var filter = require('../libs/BaseFilter');

module.exports = function(req, res, cb) {

	filter.series([
		function(next) {
			filter.prepare(req, res, next);
		},
		function(next){
			filter.extendResponse(req, res, next);
		},
		function(next){
			filter.isUnderMaintenanceForAllUser(req, res, next);
		},
		function(next){
			filter.extendRequest(req, res, next);
		},
	],function(err, data){
		if (err) return res.pack(null, err);
		cb();
	});
	
}