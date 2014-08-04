
var util = require('util');

module.exports = CodeUtils;

function CodeUtils(res, code, params) {
  var codeMsg = {};
  codeMsg.code = CodeUtils[code]||CodeUtils.NORMAL;
  codeMsg.data = null;
  if (params){
    codeMsg.msg = res.i18n.apply(this, [codeMsg.code].concat(params));
    //codeMsg.msg = res.i18n.apply(this, array_merge([codeMsg.code], params));
  }else{
    codeMsg.msg  = res.i18n(codeMsg.code);
  }
  return codeMsg;
}

CodeUtils.Error = function(message) {
  // in production mode, should disable this error stack 
  // possibly insecure
  Error.captureStackTrace(this, this);
  this.code = CodeUtils[message];
  this.msg = message;
}

util.inherits(CodeUtils.Error, Error);

/*
  ATTENTION: the suffix number identify how many parameters need to be passed.
  Thus, this how we call it:
      var msg = CodeUtils(res, msgUtils.PASSWORD_NOT_MATCHED, [password, rptpassword]);
*/

CodeUtils.PASSWORD_NOT_MATCHED = 100;
CodeUtils.PASSWORD_INVALID = 101;

CodeUtils.USER_INVALID = 110;
CodeUtils.USER_DUPLICATE = 111;
CodeUtils.USER_NONE = 112;
CodeUtils.USER_SESSION_SET_ERROR = 113;
CodeUtils.USER_BANNED = 114;

CodeUtils.WORLD_DUPLICATE = 120;
CodeUtils.WORLD_NONE = 121;
CodeUtils.WORLD_CREATE_FAIL = 122;

CodeUtils.MISS_VERSION = 1000;
CodeUtils.CONFLICT_VERSION = 1001;

CodeUtils.AUTH_NO_SID = 1011;
CodeUtils.AUTH_BAD_SID= 1012;
CodeUtils.AUTH_EXPIRED_SID = 1013;
CodeUtils.AUTH_USER_NONE = 1014;

CodeUtils.SERVICE_UNAVAILABLE = 1015;

CodeUtils.NORMAL = 200;
CodeUtils.BAD_REQUEST = 400;
CodeUtils.FORBIDDEN = 403;
CodeUtils.NOT_FOUND = 404;
CodeUtils.ERROR_INTERNAL = 500;

// function array_merge() {
//   //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
//   //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
//   //   example 1: array_merge(arr1, arr2)
//   //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
//   //   example 2: arr1 = []
//   //   example 2: arr2 = {1: "data"}
//   //   example 2: array_merge(arr1, arr2)
//   //   returns 2: {0: "data"}

//   var args = Array.prototype.slice.call(arguments),
//     argl = args.length,
//     arg,
//     retObj = {},
//     k = '',
//     argil = 0,
//     j = 0,
//     i = 0,
//     ct = 0,
//     toStr = Object.prototype.toString,
//     retArr = true;

//   for (i = 0; i < argl; i++) {
//     if (toStr.call(args[i]) !== '[object Array]') {
//       retArr = false;
//       break;
//     }
//   }

//   if (retArr) {
//     retArr = [];
//     for (i = 0; i < argl; i++) {
//       retArr = retArr.concat(args[i]);
//     }
//     return retArr;
//   }

//   for (i = 0, ct = 0; i < argl; i++) {
//     arg = args[i];
//     if (toStr.call(arg) === '[object Array]') {
//       for (j = 0, argil = arg.length; j < argil; j++) {
//         retObj[ct++] = arg[j];
//       }
//     } else {
//       for (k in arg) {
//         if (arg.hasOwnProperty(k)) {
//           if (parseInt(k, 10) + '' === k) {
//             retObj[ct++] = arg[k];
//           } else {
//             retObj[k] = arg[k];
//           }
//         }
//       }
//     }
//   }
//   return retObj;
// }




