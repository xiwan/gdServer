'use strict';

var Class = require('../utils/ClassUtils');
var _ = require('lodash');
var util = require('util');

module.exports = (function(){

	var BaseModel = {};

	BaseModel.extend = function(attributes){
		var _BaseModel = new Class();

		_BaseModel.classname = "BaseModel";
		_BaseModel.autoCreatedAt = false;
		_BaseModel.autoUpdatedAt = false;

		_BaseModel.attributes = {
			createdAt: 'integer',
		  updatedAt: 'integer',	

		  toJSON: function(){
		    var obj = this.toObject();
		    delete obj.id;
		    return obj;
		  },	
		};

		// instance function binded to static function
		_BaseModel.info = _BaseModel.info;
		_BaseModel.debug = _BaseModel.debug;
		_BaseModel.warn = _BaseModel.warn;
		_BaseModel.err = _BaseModel.err;

		// attributes merge
		_.extend(_BaseModel.attributes, attributes);
		// _.clone(_BaseModel, true)
		return _BaseModel;
	}

	return BaseModel;
}());

