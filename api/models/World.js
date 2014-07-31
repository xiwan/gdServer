'use strict';

var misc = require('../utils/MiscUtils');
var BaseModel = require('./BaseModel');

var _fields = {
  name: { type: 'string', minLength: 4, maxLength: 32, required: true, },
  ipAddr: { type: 'ipv4' },
  port: { type: 'integer', required: true, },
  delay: { type: 'integer', defaultsTo: 0, },
  population: { type: 'integer', defaultsTo: 0, },
  capacity: { type: 'integer', required: true, },
  disabled: { type: 'boolean', defaultsTo: true },
  entryLevel: { type: 'integer', defaultsTo: 0, },
};

var World = BaseModel.extend(_fields);
World.classname = "World";

// Lifecycle callback
World.beforeCreate =  function(values, next) {
  console.log(values)
	if (values.name == null || values.port == null || values.capacity == null) {
		next(new Error("Config structure is invalid"));
	}else {
    var now = misc.now();
    values.createdAt = now;
    values.updatedAt = now;
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

World.getOne = function(port, cb) {
	this
		.findOneByPort(port)
		.exec(function(err, world){
      if (world){
        world = world.toJSON();
      }
			cb(err, world);
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
		disabled: true,
		entryLevel: 0
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
      world.updatedAt = misc.now();
      world.save(function(err){
        cb(err, world);
      });
    });  
};

module.exports = World;


