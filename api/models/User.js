'use strict';

var crypt = require('../utils/CryptUtils');
var misc = require('../utils/MiscUtils');
var BaseModel = require('../libs/BaseModel');

var _fields = {
  username: { type: 'string', maxLength: 32, minLength: 4, required: true, },
  sid: { type: 'string', maxLength: 32, defaultsTo: 'unkown', },
  password: { type: 'string', maxLength: 32, minLength: 8, required: true, },
  phoneNumber: { type: 'string', required: true, },
  world: { type: 'string', minLength: 4, maxLength: 32, defaultsTo: 'unkown', },
  ipAddr: { type: 'string', defaultsTo: '127.0.0.1', },
  city: { type: 'string', defaultsTo: 'unkown', },
  country: { type: 'string', defaultsTo: 'unkown', },
  banned: { type: 'boolean', defaultsTo: false, },
  lastLoginWorld: { type: 'string', defaultsTo: 'unkown', },
  lastLoginAt: 'integer',

  toJSON: function(){
    var obj = this.toObject();
    delete obj.id;
    delete obj.password;
    return obj;
  },
};

var User = BaseModel.extend(_fields, "mongo_gdHub");
User.classname = "User";
var self = User; //Attention: this and self are not same object

// Lifecycle callback
User.beforeCreate = function(values, next){
  crypt.md5(values.password, null, function(err, hash){
    if(err) return next(err);
    var now = misc.now();
    values.lastLoginAt = now;
    values.createdAt = now;
    values.updatedAt = now;
    values.password = hash;
    next();
  });
};

User.createOne = function(username, phoneNumber, password, cb) {
	this
		.create({
      username: username,
      phoneNumber: phoneNumber || '111-222-333',
      password: password || '12345678',
      banned: false,
    })
		.done(function(err, user){
			if(err) return cb(err);
			cb(null, user);
		});
};

User.updateSid = function(username, sid, cb) {
  this
    .findOneByUsername(username)
    .then(function(user){
      user.sid = sid;
      user.updatedAt = misc.now();
      user.save(function(err){
        cb(err, user);
      });
    });
};

User.updateWorld = function(username, worldname, cb) {
  this
    .findOneByUsername(username)
    .then(function(user){
      user.lastLoginWorld = worldname;
      user.lastLoginAt = misc.now();
      user.updatedAt = misc.now();
      user.save(function(err){
        cb(err, user);
      });
    });
}

User.getOne = function(username, cb){
  this
    .findOne()
    .where({username: username})
    .done(function(err, user){
      if(err) return cb(err);
      if (user){
        user = user.toJSON();
      }
      cb(null, user);
    });
};

User.getOneByUserAndPass = function(username, password, cb) {
  var that = this;
  self.waterfall([
    function(next){
      crypt.md5(password, null, next);
    },
    function(hash, next) {
      that
        .findOne()
        .where({username: username, password: hash})
        .done(next);
    }
  ], function(err, user) {
    if(err) return cb(err);
    if (user){
      user = user.toJSON();
    }
    cb(null, user);
  });

};

User.getOneByUserAndWorld = function(username, worldname, cb) {
  var where = {username: username};
  if (worldname){
    where.lastLoginWorld = worldname;
  }

  this
    .findOne()
    .where(where)
    .done(function(err, user){
      if(err) return cb(err);
      if (user){
        user = user.toJSON();
      }
      cb(err, user);
    });
};

module.exports = User;
