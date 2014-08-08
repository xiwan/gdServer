
module.exports = {

  '/gate': {
    view: 'gate/index',
  },

  'post /gate/user/login': 'GateController.userLogin',
  'post /gate/user/create': 'GateController.userCreate',
  'post /gate/user/weak': 'GateController.userWeak',

  'get /gate/world/list': 'GateController.worldList',
  'post /gate/world/choose': 'GateController.worldChoose',

  'get /lobby/welcome': 'LobbyController.welcome',
};