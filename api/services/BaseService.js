'use strict';

var code = require('../utils/CodeUtils');
var logger = require('../utils/LoggerUtils');
var Class = require('../utils/ClassUtils');
var util = require('util');
var _ = require('underscore');

module.exports = BaseService;

// BaseService
function BaseService(res) {
	BaseService.super_.apply(this, arguments);
	this.classname = "BaseService";
	this.res = res;
	this.rslt = code(res);
};

util.inherits(BaseService, Class);

// call this at beginning of service function
BaseService.prototype.checkpoint = function(pre_rslt){
	var rslt = pre_rslt || this.rslt;
	return (rslt.code == code.NORMAL) ? true: false;
};

BaseService.prototype.wrapCode = function(_code, _params){
	return code(this.res, code[_code], _params);
};



