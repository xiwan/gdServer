'use strict';

var Class = require('./ExtendClass');
var _ = require('lodash');
var util = require('util');

module.exports = (function(){
	var BaseController = {};

	BaseController.extend = function(classname, config){

		function _BaseController() {
			Class.apply(this, arguments);
			this.classname = classname||"BaseController";
			this._config = {};
		}

		util.inherits(_BaseController, Class);
		
		var _BaseController_ = new _BaseController();
		if (config){
			_.extend(_BaseController_._config, config);
		}

		return _BaseController_;
	}

	return BaseController;
}());