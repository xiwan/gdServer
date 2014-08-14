'use strict';

var crypt = require('../utils/CryptUtils');
var misc = require('../utils/MiscUtils');
var BaseModel = require('../libs/BaseModel');

var _fields = {
  username:         // username, primary key
    { type: 'string', minLength: 4, maxLength: 32, required: true, },
  sid:              // user sid
    { type: 'string', maxLength: 32, defaultsTo: 'unkown', },
  password:         // password
    { type: 'string', minLength: 8, maxLength: 32, required: true, },
  phoneNumber:      // phone number
    { type: 'string', required: true, },
  maxFriend:        // limitation of friend        
    { type: 'integer', defaultsTo: 50, },
  ipAddr:           // user ip address
    { type: 'string', defaultsTo: '127.0.0.1', },
  address: 
    { type: 'json', defaultsTo: {street: 'unkonw', city: 'unkown', country: 'unkonw'}},
  // city:             // user city
  //   { type: 'string', defaultsTo: 'unkown', },
  // country:          // user country
  //   { type: 'string', defaultsTo: 'unkown', },
  banned:           // banned flag
    { type: 'boolean', defaultsTo: false, },
  tutorial:         // is a tutorial player?
    { type: 'integer', defaultsTo: 0, },
  onMission:        // is on mission ?
    {type: 'boolean', defaultsTo: false, },
  characters:        // is on mission ?
    {type: 'string', },
  lastLoginWorld:   // last time where user played in
    { type: 'string', defaultsTo: 'unkown', },
  lastLoginAt:      // last time user login at
    { type: 'integer', },

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
      password: password,
      banned: false,
    })
		.exec(function(err, user){
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
    .exec(function(err, user){
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
        .exec(next);
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
    .exec(function(err, user){
      if(err) return cb(err);
      if (user){
        user = user.toJSON();
      }
      cb(err, user);
    });
};

module.exports = User;
