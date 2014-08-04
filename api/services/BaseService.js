'use strict';

var code = require('../utils/CodeUtils');
var Class = require('../utils/ClassUtils');
var util = require('util');

module.exports = (function(){
	var BaseService = {};

	BaseService.extend = function(classname){

		function _BaseService() {
			Class.apply(this, arguments);
			this.classname = classname||"BaseService";
		}

		util.inherits(_BaseService, Class);


		_BaseService.prototype.isOk = function(_code) {
			return (_code.code == code.NORMAL) ? true: false;
		};

		_BaseService.prototype.isCode = function(_code){
			return (code[_code]);
		}

		return new _BaseService();
	}

	return BaseService;
}());

// module.exports = BaseService;

// // BaseService
// function BaseService(res) {
// 	BaseService.super_.apply(this, arguments);
// 	this.classname = "BaseService";
// 	this.res = res;
// 	this.rslt = code(res);
// };

// util.inherits(BaseService, Class);

// // call this at beginning of service function
// BaseService.prototype.checkpoint = function(pre_rslt){
// 	var rslt = pre_rslt || this.rslt;
// 	return (rslt.code == code.NORMAL) ? true: false;
// };

// // example: wrapCode("PASSWORD_NOT_MATCHED", "password1", "password2");
// BaseService.prototype.wrapCode = function(){
// 	var _code = _.toArray(arguments)[0];
// 	var _params = _.toArray(arguments).slice(1);
// 	return code(this.res, _code, _params);
// };



