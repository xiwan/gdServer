'use strict';

var code = require('../utils/CodeUtils');

module.exports = BaseService;

// BaseService
function BaseService(res){
	this.res = res;
	this.rslt = code(res);
};

// call this at beginning of service function
BaseService.prototype.checkpoint = function(pre_rslt){
	var rslt = pre_rslt || this.rslt;
	return (rslt.code == code.NORMAL) ? true: false;
};

BaseService.prototype.wrapCode = function(_code, _params){
	return code(this.res, code[_code], _params);
}