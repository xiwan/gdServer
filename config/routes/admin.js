
module.exports = {
	prefix : '/v2',

	'get /admin': 'AdminController.index',
  'get /admin/world/list': 'AdminController.worldList',
  'post /admin/world/create': 'AdminController.worldCreate',
};