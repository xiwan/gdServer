'use strict';

var crypt = require('../utils/CryptUtils');
var misc = require('../utils/MiscUtils');
var BaseModel = require('./BaseModel');

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

var User = BaseModel.extend(_fields);
User.classname = "User";

// Lifecycle callback
User.beforeCreate = function(values, next){
  crypt.md5(values.password, null, function(err, hash){
    User.debug(hash);
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
  this.debug(username, phoneNumber, password);
	this
		.create({
      username: username,
      phoneNumber: phoneNumber || '111-222-333',
      password: password,
      banned: false,
    })
		.done(function(err, user){
			if(err) return cb(err);
			cb(err, user);
		});
};

User.updateSid = function(username, sid, cb) {
  this
    .findOneByUsername(username)
    .then(function(user){
      user.sid = sid;
      user.save(function(err){
        cb(err, user);
      });
    });
};

User.getOne = function(username, cb){
  this
    .findOne()
    .where({username: username})
    .done(function(err, user){
      if(err) return cb(err);
      if (user){
        user = user.toJSON();
      }
      cb(err, user);
    });
};

User.getOneByUserAndPass = function(username, password, cb) {
  var self = this;
  crypt.md5(password, null, function(err, hash){
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
};

User.getOneByUserAndWorld = function(username, worldname, cb) {
  var where = {username: username};
  if (worldname)
    where.world = worldname;

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
