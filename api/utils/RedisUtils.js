var _redis = require('redis');
var client = _redis.createClient();

client.on("error", function(err){
	console.log("Error " + err);
});

var RedisUtils = {};

RedisUtils.test = function () {
	console.log("test")
}