'use strict';

var BaseModel = require('./BaseModel');
var _ = require('lodash');

module.exports = (function(){

	var _fields = {
		version: { type: 'integer', defaultsTo: 0, required: true, },
	};

	// this is model for master data
	var VersionModel = {};

	VersionModel.extend = function(attributes){
		
		var _VersionModel = BaseModel.extend(_fields);
		_VersionModel.classname = "VersionModel";

		// static functions
		_VersionModel.getVersion = function(){
			return this.version;
		};

		_VersionModel.setVersion = function(v){
			this.version = v;
		};

		// attributes merge
		if (attributes){
			_.extend(_VersionModel.attributes, attributes);
		}
		return _VersionModel;
	};

	return VersionModel;
}());
