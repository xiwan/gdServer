'use strict';

var BaseController = require('../libs/BaseController');

var LobbyController = BaseController.extend("LobbyController");
var self = LobbyController;

LobbyController.welcome = function(req, res){
	res.pack("welcome to the lobby");
};

module.exports = LobbyController;