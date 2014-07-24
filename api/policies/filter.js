module.exports = function(req, res, next) {
	
	// locale check, default set is 'en'
	localeCheck(req, res, next);

	return next();
}

function localeCheck(req, res, next){
	var lang = req.param("lang");
	if (lang) {
		req.locale = lang;
	}else {
		req.locale = 'en';
	}
}