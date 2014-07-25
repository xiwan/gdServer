/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var crypt = require('../utils/CryptUtils');
var logger = require('../utils/LoggerUtils');

var User = {

	autoCreatedAt: false, 

  attributes: {
  	username: {
  		type: 'string',
  		maxLength: 32,
  		minLength: 4,
  		required: true,
  	},
  	password: {
  		type: 'string',
  		maxLength: 32,
  		minLength: 8,
  		required: true,
  	},
  	phoneNumber: {
  		type: 'string',
  		defaultsTo: '111-222-333',
  		required: true,
  	},
  	ipAddr: {
  		type: 'string',
  		defaultsTo: '127.0.0.1',
  	},
  	city: {
  		type: 'string',
  		defaultsTo: 'unkown',
  	},
  	country: {
  		type: 'string',
  		defaultsTo: 'unkown',
  	},
  	lastLoginAt: 'datetime',
  	lastLoginWorld: {
  		type: 'string',
  		defaultsTo: 'unkown',
  	},
  	banned: {
  		type: 'boolean',
  		defaultsTo: false,
  	},
  	createdAt: 'datetime',
  	updatedAt: 'datetime',

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
  		var date = new Date();
	  	values.lastLoginAt = date;
	  	values.createdAt = date;
	  	values.updatedAt = date;
	  	values.password = hash;
	  	next();
  	});
  }

};

User.createOne = function(username, phoneNumber, password, cb) {
	var user = {
		username: username,
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

User.getOne = function(flag, username, password, cb){
	var self = this;
	if (!flag){
		self
			.findOne()
			.where({username: username})
			.done(function(err, user){
				if(err) return cb(err);
				if (user){
					user = user.toJSON();
				}
				cb(err, user);
			});		
	} else {
		crypt.md5(password, function(err, hash){
  		if(err) return next(err);
			self
				.findOne()
				.where({username: username})
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
