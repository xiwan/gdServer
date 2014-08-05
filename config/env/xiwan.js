var logger = require('../../api/utils/LoggerUtils');

module.exports = {

	// do not change salt too often in production mode, 
	// all logined user will be kicked out at ur own risk;
	salt: '8f714e367ceecbcd77e6349f9c3cbc96',

	env: {
		name: 'localhost',
		port: 8080,		
	},

	database: {
		'default': 'mongo',
		mongo: {
			module: 'sails-mongo',
	    user: 'gdConn',
	    password: '111111',
	    database: 'gdGame',
	    schema: true,
	    replSet: {
	      	options: {
	        	readPreference: 'secondary',
	        	poolSize: 10,
	        	logger: logger,
	      	},
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
	      	}]
	    }
		},
	},

	redis: {
		host: '127.0.0.1',
		port: 6379,
	},
	
}
