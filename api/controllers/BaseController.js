'use strict';

var Class = require('../utils/ClassUtils');
var _ = require('lodash');
var util = require('util');

module.exports = (function(){
	var BaseController = {};

	BaseController.extend = function(classname){

		function _BaseController() {
			Class.apply(this, arguments);
			this.classname = classname||"BaseController";
			this._config = {};
		}

		util.inherits(_BaseController, Class);

		return new _BaseController();
	}

	return BaseController;
}());