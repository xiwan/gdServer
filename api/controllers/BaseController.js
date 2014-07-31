'use strict';

var Class = require('../utils/ClassUtils');

module.exports = (function(){
	var BaseController = {};

	BaseController.extend = function(_config){
		var _BaseController = new Class();

		_BaseController.classname = "BaseController";
		_BaseController._config = {};

		// _config merge
		//_.extend(_BaseModel._config, _config);

		// instance function binded to static function
		_BaseController.info = _BaseController.info;
		_BaseController.debug = _BaseController.debug;
		_BaseController.warn = _BaseController.warn;
		_BaseController.err = _BaseController.err;

		return _BaseController;
	}

	return BaseController;
}());