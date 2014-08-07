'use strict';

var filter = require('./Filter');

module.exports = function(req, res, cb) {

	filter.series([
		function(next) {
			filter.prepare(req, res, next);
		},
		function(next){
			filter.extendResponse(req, res, next);
		},
		// is authed user ?
		function(next) {
			filter.isAuthed(req, res, next);
		},
		// master data version check
		function(next) {
			filter.isValidVersion(req, res, next);
		},
		function(next) {
			filter.isBanned(req, res, next);
		},
		function(next){
			filter.extendRequest(req, res, next);
		},
	],function(err, data){
		if (err) return res.pack(null, err);
		cb();
	});

}