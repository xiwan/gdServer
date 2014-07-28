'use strict';

var Class = require('../utils/ClassUtils');
var util = require('util');

module.exports = Filter;

function Filter(req, res){
	Filter.super_.apply(this, arguments);
	this.classname = "Filter";

	this.debug(req.method, req.url);
	this.debug("Body: ", req.body);

};

util.inherits(Filter, Class);

Filter.prototype.lang = function (req, res, cb){
	var lang = req.param("lang");
	if (lang) {
		req.locale = lang;
	}else {
		req.locale = 'en';
	}
	cb(null, req);
};

Filter.prototype.version = function (req, res, cb) {
	//logger.debug(req.param("v"));
	//todo: check request version
	// if v < db v, then go to master data downloading logic
	// if v = db v, nothing happend,
	// if v > db v, degrade to db v or error happens
	cb(null, req);
};

Filter.prototype.isUnderMaintenanceForAllUser = function (req, res, cb) {
	// here we retrieve world status
	var maintenance = {
		isUnderMaintenance: false,
	};
	if (maintenance.isUnderMaintenance) {
		cb(this.Error("SERVICE_UNAVAILABLE"), req);
	}else {
		cb(null, req);
	}
}

