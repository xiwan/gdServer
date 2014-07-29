/**
 * User
 *
 * @module      :: Utils
 * @description :: Extended logger 
 */

var logger = require("graceful-logger");

var LoggerUtils = {
	// info < debug < warn < err;
	lv: 'info',
};

LoggerUtils.level = function(level) {
	logger.setLevel("[" + level + "]");
};

LoggerUtils.info = function(){
	if (arguments && (this.lv == 'info')){
		logger.format(':level.green :msg.grey');
		logger.info.apply(this, arguments);
	}	
};

LoggerUtils.debug = function(){
	if (arguments && (this.lv == 'info' || this.lv == 'debug')){
		logger.format(':level.blue :msg.grey');
		logger.debug.apply(this, arguments);
	}	
};

LoggerUtils.warn = function(){
	if (arguments && (this.lv == 'info' || this.lv == 'debug' || this.lv = 'warn')){
		logger.format(':level.yellow :msg.grey');
		logger.warn.apply(this, arguments);
	}
};

LoggerUtils.err = function(){
	if (arguments && (this.lv == 'info' || this.lv == 'debug' || this.lv = 'warn' || this.lv == 'err')){
		logger.format(':level.red :msg.grey');
		logger.err.apply(this, arguments);
	}
};

module.exports = LoggerUtils;