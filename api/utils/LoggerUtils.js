/**
 * User
 *
 * @module      :: Utils
 * @description :: Extended logger 
 */

var logger = require("graceful-logger");
var _ = require("lodash");

var LoggerUtils = {
	// info < debug < warn < err;
	lv: 'info',
};

LoggerUtils.level = function(level) {
	logger.setLevel("[" + level + "]");
};

LoggerUtils.info = function(){
	var _lv = this.lv.toLowerCase();
	if (!_.isEmpty(arguments[0]) && (_lv == 'info')){
		logger.format(':level.green :msg.grey');
		logger.info.apply(this, arguments);
	}	
};

LoggerUtils.debug = function(){
	var _lv = this.lv.toLowerCase();
	if (!_.isEmpty(arguments[0])  && (_lv == 'info' || _lv == 'debug')){
		logger.format(':level.blue :msg.grey');
		logger.debug.apply(this, arguments);
	}	
};

LoggerUtils.warn = function(){
	var _lv = this.lv.toLowerCase();
	if (!_.isEmpty(arguments[0])  && (_lv == 'info' || _lv == 'debug' || _lv =='warn')){
		logger.format(':level.yellow :msg.grey');
		logger.warn.apply(this, arguments);
	}
};

LoggerUtils.err = function(){
	var _lv = this.lv.toLowerCase();
	if (!_.isEmpty(arguments[0])  && (_lv == 'info' || _lv == 'debug' || _lv == 'warn' || _lv == 'err')){	
		logger.format(':level.red :msg.grey');
		logger.err.apply(this, arguments);
	}
};

module.exports = LoggerUtils;