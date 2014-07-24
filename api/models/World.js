'use strict';

var World = {

  attributes: {
  	name: {
  		type: 'string',
  		minLength: 4,
      maxLength: 32,
  		required: true,
  	},
  	ipAddr: {
  		type: 'ipv4'
  	},
  	port: {
  		type: 'integer',
  		required: true,
  	},
  	delay: {
  		type: 'integer',
  		defaultsTo: 0,
  	},
  	population: {
  		type: 'integer',
  		defaultsTo: 0,
  	},
  	capacity: {
  		type: 'integer',
  		required: true,
  	},
  	disabled: 'boolean',
  	entryLevel: {
  		type: 'integer',
  		defaultsTo: 0,
  	},


		toJSON: function(){
			var obj = this.toObject();
			delete obj.id;
			return obj;
		}
  },

  beforeCreate: function(values, next) {
  	if (values.name == null || values.port == null || values.capacity == null) {
  		next(new Error("Config structure is invalid"));
  	}else {
  		next();
  	}
	},

};

// find all worlds
World.getAll = function(cb){
	this
		.find()
		.exec(function(err, data){
			cb(err, data);
		});
};

World.getOne = function(port, cb) {
	this
		.findOneByPort(port)
		.exec(function(err, data){
			cb(err, data);
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
		capacity: cap,
		disabled: true,
		entryLevel: 0
	};

	this
		.create(world)
		.done(function(err, data){
			cb(err, data);
		});

}



module.exports = World;
