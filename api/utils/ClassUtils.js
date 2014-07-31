'use strict';

var logger = require('./LoggerUtils');
var code = require('../utils/CodeUtils');

module.exports = ClassUtils;

function ClassUtils(classname){
	this.classname = classname||"Class";
};

ClassUtils.prototype.info = function() {
	logger.level(this.classname + " info");
	logger.info.apply(logger, arguments);
};

ClassUtils.prototype.debug = function() {
	logger.level(this.classname + " debug");
	logger.debug.apply(logger, arguments);
};

ClassUtils.prototype.warn = function() {
	logger.level(this.classname + " warn");
	logger.warn.apply(logger, arguments);
};

ClassUtils.prototype.err = function() {
	logger.level(this.classname + " err");
	logger.err.apply(logger, arguments);
};

ClassUtils.prototype.Error = function(name){
	return new code.Error(name)
};