'use strict';

var logger = require('./LoggerUtils');
var code = require('../utils/CodeUtils');

module.exports = ClassUtils;

function ClassUtils(){
	this.classname = "Class";
	logger.lv = global.sails.config[sails.config.environment].log.lv;
};

ClassUtils.prototype.info = function() {
	logger.level("info " + this.classname);
	logger.info.apply(logger, arguments);
};

ClassUtils.prototype.debug = function() {
	logger.level("debug " + this.classname);
	logger.debug.apply(logger, arguments);
};

ClassUtils.prototype.warn = function() {
	logger.level("warn " + this.classname);
	logger.warn.apply(logger, arguments);
};

ClassUtils.prototype.err = function() {
	logger.level("err " + this.classname);
	logger.err.apply(logger, arguments);
};

ClassUtils.prototype.Error = function(name){
	return new code.Error(name)
};