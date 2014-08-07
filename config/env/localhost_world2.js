var logger = require('../../api/utils/LoggerUtils');

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

module.exports = {

	// do not change salt too often in production mode, 
	// all logined user will be kicked out at ur own risk;
	salt: '8f714e367ceecbcd77e6349f9c3cbc96',

	env: {
		name: 'world2', // world name
		port: 9002,
		router: ['app'],		
	},

	redis: {
		host: '127.0.0.1',
		port: 6379,
	},

	database: {
		'default': 'mongo_gdHub',

		mongo_gdHub: {
			module: 'sails-mongo',
	    user: 'gdHub',
	    password: '1q2w3e4R',
	    database: 'gdHub',
	    schema: true,
	    replSet: _replSet,
		},

		mongo_gdGame2: {
			module: 'sails-mongo',
	    user: 'gdGame2',
	    password: '1q2w3e4R',
	    database: 'gdGame2',
	    schema: true,
	    replSet: _replSet,
		},

	},

	maintenance: {
		users: ['xiwan', 'gdGame2'],
	},
	
}
