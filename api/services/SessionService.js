
var util = require('util');
var async = require('async');
var logger = require('../utils/LoggerUtils');
//var RedisUtils = require('../utils/RedisUtils');
var BaseService = require('./BaseService');

module.exports = SessionService;

function SessionService(res) {
	SessionService.super_.apply(this, arguments);
}

util.inherits(SessionService, BaseService);

SessionService.prototype.test = function(rslt, cb){
	var self = this;
	logger.debug(self.checkpoint(rslt));
	cb(null, self.rslt);
}