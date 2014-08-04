
module.exports = ResponseUtils;

var ResponseUtils = {
	

};

function ResponseUtils(req, res) {
  response = {};
  response.code = ResponseUtils[code]||ResponseUtils.NORMAL;
  response.data = null;
  response.message = null;
  //return response;

}


ResponseUtils.PASSWORD_NOT_MATCHED = 100;
ResponseUtils.PASSWORD_INVALID = 101;

ResponseUtils.USER_INVALID = 110;
ResponseUtils.USER_DUPLICATE = 111;
ResponseUtils.USER_NONE = 112;
ResponseUtils.USER_SESSION_SET_ERROR = 113;
ResponseUtils.USER_BANNED = 114;

ResponseUtils.WORLD_DUPLICATE = 120;
ResponseUtils.WORLD_NONE = 121;
ResponseUtils.WORLD_CREATE_FAIL = 122;

ResponseUtils.MISS_VERSION = 1000;
ResponseUtils.CONFLICT_VERSION = 1001;

ResponseUtils.AUTH_NO_SID = 1011;
ResponseUtils.AUTH_BAD_SID= 1012;
ResponseUtils.AUTH_EXPIRED_SID = 1013;
ResponseUtils.AUTH_USER_NONE = 1014;

ResponseUtils.SERVICE_UNAVAILABLE = 1015;

ResponseUtils.NORMAL = 200;
ResponseUtils.BAD_REQUEST = 400;
ResponseUtils.FORBIDDEN = 403;
ResponseUtils.NOT_FOUND = 404;
ResponseUtils.ERROR_INTERNAL = 500;