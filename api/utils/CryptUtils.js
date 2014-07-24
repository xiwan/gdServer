var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

var CryptUtils = {
	salt: 'crypt',
};

//CryptUtils.salt = sails.config[sails.config.environment].salt||'salt';

CryptUtils.setSalt = function(salt){
	this.salt = salt;
}

CryptUtils.md5 = function (str, cb) {
	var md5 = crypto.createHash('md5');
	var _str = '';
	try{
		_str = md5.update(str).digest('base64');
	} catch(err) {
		return cb(err, _str); 
	}
	cb(null, _str)
}

module.exports = CryptUtils;