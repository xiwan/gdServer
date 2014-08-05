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




