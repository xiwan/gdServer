'use strict';

var Class = require('./ExtendClass');
var _ = require('lodash');
var util = require('util');

module.exports = (function(){

	var BaseModel = {};

	BaseModel.extend = function(attributes, adapter){

		function _BaseModel(){
			Class.apply(this, arguments);
			this.classname = "BaseModel";
			// use a different adapter
			this.adapter = adapter;

			this.autoCreatedAt = false;
			this.autoUpdatedAt = false;

			this.attributes = {
				createdAt: 'integer',
			  updatedAt: 'integer',	

			  toJSON: function(){
			    var obj = this.toObject();
			    delete obj.id;
			    return obj;
			  },	
			};
		}

		util.inherits(_BaseModel, Class);

		_BaseModel.prototype.findCache = function(key){

		};

		_BaseModel.prototype.findLocalCache = function(key){

		};
		
		// attributes merge
		var _BaseModel_ = new _BaseModel();
		if (attributes){
			_.extend(_BaseModel_.attributes, attributes);
		}

		// _.clone(_BaseModel, true)
		return _BaseModel_;
	}

	return BaseModel;
}());

