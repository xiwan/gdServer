/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var crypt = require('../utils/CryptUtils');

var User = {

  attributes: {
  	nickname: 'string',
  	phoneNumber: {
  		type: 'string',
  		defaultsTo: '111-222-333'
  	},
  	password: {
  		type: 'string',
  		maxLength: 32,
  		minLength: 8,
  		required: true,
  	},

  	toJSON: function(){
			var obj = this.toObject();
			delete obj.id;
			delete obj.password;
			return obj;
		},

  },

  beforeCreate: function(values, next){
  	crypt.md5(values.password, function(err, hash){
  		if(err) return next(err);
	  	values.password = hash;
	  	next();
  	});
  }

};

User.createOne = function(nickname, phoneNumber, password, cb) {
	var user = {
		nickname: nickname,
		phoneNumber: phoneNumber,
		password: password
	};

	this
		.create(user)
		.done(function(err, user){
			if(err) return cb(err);
			cb(err, user);
		});
};

User.getOne = function(flag, nickname, password, cb){
	var self = this;
	if (!flag){
		self
			.findOneByNickname(nickname)
			.done(function(err, user){
				if(err) return cb(err);
				if (user){
					user = user.toJSON();
				}
				cb(err, user);
			});		
	} else {
		crypt.md5(password, function(err, hash){
			sails.log.debug(hash)
  		if(err) return next(err);
			self
				.findOne()
				.where({nickname: nickname})
				.where({password: hash})
				.done(function(err, user){
					if(err) return cb(err);
					if (user){
						user = user.toJSON();
					}
					cb(err, user);
				});
  	});

	}

};

module.exports = User;
