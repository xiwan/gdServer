var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

var CryptUtils = {
	salt: '8f714e367ceecbcd77e6349f9c3cbc96',
};

//CryptUtils.salt = sails.config[sails.config.environment].salt||'salt';

CryptUtils.setSalt = function(salt){
	this.salt = salt;
}

CryptUtils.md5 = function (str, digest, cb) {
	var md5 = crypto.createHash('md5');
	var _str = '';
	try{
		_str = md5.update(this.salt).update(str).digest(digest||'base64');
	} catch(err) {
		return cb(err, _str); 
	}
	cb(null, _str)
}

module.exports = CryptUtils;