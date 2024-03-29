'use strict';

//var logger = require('./LoggerUtils');
//var code = require('../utils/CodeUtils');

module.exports = ExtendClass;

function ExtendClass(classname){
	this.classname = classname||"Class";
};

function prependClassName(classname, args) {
  var _i, _len, _results;
  _results = [];
  _results.push(classname);
  for (_i = 0, _len = args.length; _i < _len; _i++) {
    _results.push(args[_i]);
  }
  return _results;
}

ExtendClass.prototype.info = function() {		
  sails.log.info.apply(this, prependClassName(this.classname, _.toArray(arguments)));
};

ExtendClass.prototype.debug = function() {
  sails.log.debug.apply(this, prependClassName(this.classname, _.toArray(arguments)));	
};

ExtendClass.prototype.warn = function() {
  sails.log.warn.apply(this, prependClassName(this.classname, _.toArray(arguments)));	
};

ExtendClass.prototype.err = function() {
  sails.log.error.apply(this, prependClassName(this.classname, _.toArray(arguments))); 
};

ExtendClass.prototype.Error = function(name){
	return null;//new code.Error(name)
};

ExtendClass.prototype._createCb = function(callback) {
    if (!callback)
        return null;
    var self = this;
    return function() {
        callback.apply(self, arguments);
    };	
};

ExtendClass.prototype._bindSelf = function(tasks) {
    for (var i in tasks) {
        var task = tasks[i];
        if (task instanceof Array) {
            var func = task[task.length-1]; 
            task[task.length-1] = this._createFunc(func)
        } else {
            tasks[i] = this._createFunc(task);
        }
    }	
};

ExtendClass.prototype._createFunc = function(task, args) {
    var self = this;
    return function() {
        try {
            task.apply(self, arguments);
        } catch(e) {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] instanceof Function) {
                    arguments[i].call(self, e);
                    return;
                }
            }
            throw e;
        }
    };
};

ExtendClass.prototype.waterfall = function(tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.waterfall(tasks, callback);	
};

ExtendClass.prototype.auto = function(tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.auto(tasks, callback);	
};

ExtendClass.prototype.series = function(tasks, callback) {
    var prev;
    var self = this;
    // use async.auto
    for (var i in tasks) {
        var task = tasks[i];
        if (prev) {
            tasks[i] = [prev, this._createFunc(task, arguments)];
        } else {
            tasks[i] = this._createFunc(task, arguments);
        }
        prev = i;
    }
    callback = this._createCb(callback);
    async.auto(tasks, callback);
};

ExtendClass.prototype.forEachSeries = function(list, tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.forEachSeries(list, tasks, callback);	
};

ExtendClass.prototype.parallel = function(tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.parallel(tasks, callback);	
};

ExtendClass.prototype.map = function(list, tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.map(list, tasks, callback);	
};

ExtendClass.prototype.mapSeries = function(list, tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.mapSeries(list, tasks, callback);	
};

ExtendClass.prototype.getCallback = function(tasks, callback) {
    var key, cb;
    if (arguments.length == 1) {
        cb = arguments[0];
    } else {
        key = arguments[0];
        cb = arguments[1];
    }
    return function(err, res) {
        if (err) {
            cb(err);
        } else {
            if (!key) {
                var arr = Object.keys(res);
                key = arr[arr.length-1];
            }
            cb(null, res[key]);
        }
    }	
};

