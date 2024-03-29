'use strict';

var BaseModel = require('./BaseModel');
var _ = require('lodash');

module.exports = (function(){

	var _fields = {
		version: { type: 'integer', defaultsTo: 0, required: true, },
	};

	// this is model for master data
	var VersionModel = {};

	VersionModel.extend = function(attributes, adapter){
		
		var _VersionModel = BaseModel.extend(_fields, adapter);
		_VersionModel.classname = "VersionModel";

		// static functions
		_VersionModel.getVersion = function(){
			return this.version;
		};

		_VersionModel.setVersion = function(v){
			this.version = v;
		};

		_VersionModel.findCache = function(key){

		};

		_VersionModel.findLocalCache = function(key){

		};

		// attributes merge
		if (attributes){
			_.extend(_VersionModel.attributes, attributes);
		}
		return _VersionModel;
	};

	return VersionModel;
}());
