'use strict';

var BaseModel = require('../libs/BaseModel');

var _fields = {
		key: 
			{ type: 'string', maxLength: 32, minLength: 4, required: true, },
		value: 
			{ type: 'string', maxLength: 128, required: true, },
};

var Config = BaseModel.extend(_fields);
Config.classname = "Config";
var self = Config;
delete Config.attributes.createdAt;
delete Config.attributes.updatedAt;

Config.getOne = function(key, cb){
	this
		.findOneByKey(key)
		.exec(function(err, _config){
			if(err) return cb(err);
			if (_config){
        _config = _config.toJSON();
      }
			cb(err, _config);
		});
};

Config.getAll = function(cb) {
	this
		.find()
		.exec(function(err, _configs){
			if(err) return cb(err);
			if (_configs){
        _configs = _configs.toJSON();
      }
			cb(err, _configs);
		});
};

module.exports = Config;