'use strict';

var BaseModel = require('../libs/BaseModel');

var _fields = {
		value: 
			{ type: 'integer', required: true, },
};

var MasterVersion = BaseModel.extend(_fields, true);
MasterVersion.classname = "MasterVersion";
var self = MasterVersion;
delete MasterVersion.attributes.createdAt;
delete MasterVersion.attributes.updatedAt;

MasterVersion.getCurrent = function(cb){
	this
		.find().limit(1)
		.exec(function(err, masterVersion){
			if(err) return cb(err);
			if (masterVersion && masterVersion.length){
        masterVersion[0] = masterVersion[0].toJSON();
        return cb(null, masterVersion[0].current);
      }
			return cb(null, 0);
		});

};

module.exports = MasterVersion;