
module.exports = {
	prefix : '/securevisit',

	'get /admin': 'AdminController.index',
  'get /admin/world/list': 'AdminController.worldList',
  'post /admin/world/create': 'AdminController.worldCreate',
};