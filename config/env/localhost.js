module.exports = {

	env: {
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
}
