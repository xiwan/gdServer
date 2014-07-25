/**
 * User
 *
 * @module      :: Utils
 * @description :: Extended logger 
 */

var logger = require("graceful-logger");

var LoggerUtils = {};

LoggerUtils.info = function(){
	if (arguments){
		logger.format(':level.green :msg.green');
		logger.info.apply(this, arguments);
	}
	
};

LoggerUtils.debug = function(){
	if (arguments){
		logger.format(':level.cyan :msg.cyan');
		logger.debug.apply(this, arguments);
	}
	
};

LoggerUtils.warn = function(){
	if (arguments){
		logger.format(':level.yellow :msg.yellow');
		logger.warn.apply(this, arguments);
	}
};

LoggerUtils.err = function(){
	if (arguments){
		logger.format(':level.red :msg.red');
		logger.err.apply(this, arguments);
	}
};

module.exports = LoggerUtils;