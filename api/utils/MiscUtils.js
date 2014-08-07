
exports.now = function() {
    return Date.now()/1000|0;
};


exports.getExternalIp = function () {
	var ifconfig = require('os').networkInterfaces();
	var device, i, I, protocol;

	for (device in ifconfig) {
		// ignore network loopback interface
		if (device.indexOf('lo') !== -1 || !ifconfig.hasOwnProperty(device)) {
			continue;
		}
		for (i=0, I=ifconfig[device].length; i<I; i++) {
			protocol = ifconfig[device][i];

			// filter for external IPv4 addresses
			if (protocol.family === 'IPv4' && protocol.internal === false) {
				// console.log('found', protocol.address);
				return protocol.address;
			}
		}
	}
	return null;
}





