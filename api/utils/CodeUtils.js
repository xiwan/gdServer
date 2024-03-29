
var util = require('util');
var rtnCodes = require('../Const').rtnCodes;

module.exports = CodeUtils;

function CodeUtils(res, code, params) {

  if (code == "BAD_REQUEST" || code instanceof BadRequestError){
    return new BadRequestError("BAD_REQUEST", code);
  }else if (code == "FORBIDDEN" || code instanceof ForbiddenError){
    return new ForbiddenError("FORBIDDEN", code);
  }else if (code == "NOT_FOUND" || code instanceof NotFoundError){
    return new NotFoundError("NOT_FOUND", code);
  }else if (code == "SERVICE_UNAVAILABLE" || code instanceof ServiceUnavailableError ){
    return new ServiceUnavailableError("SERVICE_UNAVAILABLE", code);
  }else if (code == "ERROR_INTERNAL" || code instanceof InternalError || code instanceof Error){
    return new InternalError("ERROR_INTERNAL", code);
  }

  var codeMsg = {};
  codeMsg.code = (CodeUtils.rtnCodes[code]||200) + "";
  codeMsg.message = res.i18n.apply(this, [codeMsg.code].concat(params));
  return codeMsg;
};

CodeUtils.rtnCodes = rtnCodes;

function _codeError(name, message) {
  // in production mode, should disable this error stack 
  // possibly insecure
  Error.call(this, message);
  Error.captureStackTrace(this, this.constructor);

  this.name = name;
  this.code = CodeUtils[name];
  this.message = "" + message;

  if (this.stack && this.stack.length) {
    console.log(this.stack);
  }
}

function BadRequestError(name, message) {
  _codeError.apply(this, arguments);
}

util.inherits(BadRequestError, Error);

function ForbiddenError(name, message) {
  _codeError.apply(this, arguments);
}

util.inherits(ForbiddenError, Error);

function NotFoundError(name, message) {
  _codeError.apply(this, arguments);
}

util.inherits(NotFoundError, Error);

function InternalError(name, message) {
  _codeError.apply(this, arguments);
}

util.inherits(InternalError, Error);

function ServiceUnavailableError(name, message) {
  _codeError.apply(this, arguments);
}

util.inherits(ServiceUnavailableError, Error);

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




