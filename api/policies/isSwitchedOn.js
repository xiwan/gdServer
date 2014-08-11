'use strict';

var filter = require('../libs/BaseFilter');

module.exports = function(req, res, cb) {
	
	filter.isSwitchedOn(req, res, cb);

}