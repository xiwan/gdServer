//var logger = require('../../api/utils/LoggerUtils');

var _replSet = {
	servers: [{
  	host: 'localhost',
  	port: 27017,
	},
	{	
  	host: 'localhost',
  	port: 27018,
	},
	{
  	host: 'localhost',
  	port: 27019,
	}],
	options: {
  	readPreference: 'secondary',
  	poolSize: 10,
  	//logger: logger,
	},
};

module.exports.sys = {

	// do not change salt too often in production mode, 
	// all logined user will be kicked out at ur own risk;
	salt: '8f714e367ceecbcd77e6349f9c3cbc96',

	env: {
		name: 'admin', // world name
		port: 9000,
		router: ['admin', 'app'],		
	},

	redis: {
		host: '127.0.0.1',
		port: 6379,
	},

	database: {
		//'default': 'mongo_gdHub',

		mongo_gdHub: {
			adapter: 'sails-mongo',
	    user: 'gdHub',
	    password: '1q2w3e4R',
	    database: 'gdHub',
	    schema: true,
	    replSet: _replSet
		},

		mongo_gdGame1: {
			adapter: 'sails-mongo',
	    user: 'gdGame1',
	    password: '1q2w3e4R',
	    database: 'gdGame1',
	    schema: true,
	    replSet: _replSet
		},

		mongo_gdGame2: {
			adapter: 'sails-mongo',
	    user: 'gdGame2',
	    password: '1q2w3e4R',
	    database: 'gdGame2',
	    schema: true,
	    replSet: _replSet
		},

	},

	maintenance: {
		users: ['xiwan'],
	},
	
}
