'use strict';

var Class = require('./ExtendClass');
var _ = require('lodash');
var util = require('util');

module.exports = (function(){

	var BaseModel = {
		conns: _.keys(sails.config.sys.database),
	};
	/*
		connection: true = gdGame server; false = gdHub server
	*/
	BaseModel.extend = function(attributes, connection){

		function _BaseModel(){
			Class.apply(this, arguments);
			this.classname = "BaseModel";

			// use a different adapter
			var _conn = (connection)?1:0;
			this.connection = BaseModel.conns[_conn];

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

