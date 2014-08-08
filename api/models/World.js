'use strict';

var misc = require('../utils/MiscUtils');
var BaseModel = require('../libs/BaseModel');

var _fields = {
  name: 					// world name, primary key 
  	{ type: 'string', minLength: 4, maxLength: 32, required: true, },
  ipAddr:   			// ip address 
  	{ type: 'string' },
  port: 					// world port number
  	{ type: 'integer', required: true, },
  delay: 					// request delay in ms
  	{ type: 'integer', defaultsTo: 0, },
  population: 		// current number of players in world
  	{ type: 'integer', defaultsTo: 0, },
  capacity: 			// world's capacity
  	{ type: 'integer', required: true, },
  'switch':  				// 0: normal; 1: block newbies; 2: block entry; 3: disabled;
  	{ type: 'integer', defaultsTo: 3 },
  entryLevel: 		// min level demanded
  	{ type: 'integer', defaultsTo: 0, },
  nodeEnv: 				// running config script
  	{ type: 'string',  minLength: 4, maxLength: 32, },
};

var World = BaseModel.extend(_fields, "mongo_gdHub");
World.classname = "World";
var self = World;

// Lifecycle callback
World.beforeCreate =  function(values, next) {
	if (values.name == null || values.port == null || values.capacity == null) {
		next("WORLD_CREATE_FAIL");
	}else {
    var now = misc.now();
    values.createdAt = now;
    values.updatedAt = now;
    values.ipAddr = misc.getExternalIp();
    values.nodeEnv = process.env.NODE_ENV;
		next();
	}
};

// find all worlds
World.getAll = function(cb){
	this
		.find()
		.exec(function(err, world){     
			cb(err, world);
		});
};

World.getOne = function(name, port, cb) {
	var where = {};
	if (name)
		where.name = name;
	if (port)
		where.port = port;

	this
		.findOne(where)
		.exec(function(err, world){
			if (err) return cb(err);
      if (world){
        world = world.toJSON();
      }
			cb(null, world);
		});
};

// create one world
World.createOne = function(name, port, cap, cb) {
	var world = {
		name: name,
		ipAddr: '',
		port: port,
		delay: 0,
		population: 0,
		capacity: cap||5000,
	};

	this
		.create(world)
		.done(function(err, data){
			cb(err, data);
		});

};

World.updateByPort = function(update, port, cb) {
  this
    .findOneByPort(port)
    .then(function(world){

      if (update.name) {
        world.name = update.name;
      }
      if (update.popIncr) {
        world.population += update.popIncr;
      }
      if (update['switch']) {
        world['switch'] = update['switch'];
      }

      world.ipAddr = misc.getExternalIp();
      world.nodeEnv = process.env.NODE_ENV;
      world.updatedAt = misc.now();
      
      world.save(function(err){
        cb(err, world);
      });
    });  
};

module.exports = World;


