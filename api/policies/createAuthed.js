'use strict';

var filter = require('./Filter');

module.exports = function(req, res, cb) {
	//var filter = new Filter(req, res);
	filter.url(req, res);

	filter.waterfall([
		// locale check, default set is 'en'
		function(next) {
			filter.lang(req, res, next);
		},
		function(data, next){
			filter.extendResponse(req, res, next);
		},
		function(data, next){
			filter.isUnderMaintenanceForAllUser(req, res, next);
		},
		// is authed user ?
		function(data, next) {
			filter.isAuthed(req, res, next);
		},
		// master data version check
		function(data, next) {
			filter.version(req, res, next);
		},
		function(data, next) {
			filter.isBanned(req, res, next);
		},
	], function(err, data){
		if (err) return res.pack(null, err);
		cb();
	});
	
}