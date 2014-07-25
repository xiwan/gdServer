var logger = require('../utils/LoggerUtils');

module.exports = function(req, res, next) {
	
	// request url check
	reqUrl(req, res, next);

	// master data version check
	version(req, res, next);

	// locale check, default set is 'en'
	lang(req, res, next);

	return next();
}

function version(req, res, next) {
	//logger.debug(req.param("v"));
	//todo: check request version
	// if v < db v, then go to master data downloading logic
	// if v = db v, nothing happend,
	// if v > db v, degrade to db v or error happens
};

function reqUrl(req, res, next) {
	logger.debug(req.method, req.url);
}

function lang(req, res, next){
	var lang = req.param("lang");
	if (lang) {
		req.locale = lang;
	}else {
		req.locale = 'en';
	}
}