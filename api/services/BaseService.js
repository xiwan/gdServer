'use strict';

var code = require('../utils/CodeUtils');
var Class = require('../utils/ClassUtils');
var util = require('util');

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

// example: wrapCode("PASSWORD_NOT_MATCHED", "password1", "password2");
BaseService.prototype.wrapCode = function(){
	var _code = _.toArray(arguments)[0];
	var _params = _.toArray(arguments).slice(1);
	return code(this.res, _code, _params);
};



