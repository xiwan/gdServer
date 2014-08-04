'use strict';

var logger = require('./LoggerUtils');
var code = require('../utils/CodeUtils');

module.exports = ClassUtils;

function ClassUtils(classname){
	this.classname = classname||"Class";
};

ClassUtils.prototype.info = function() {
	logger.level(this.classname + " info");
	logger.info.apply(logger, arguments);		
};

ClassUtils.prototype.debug = function() {
	logger.level(this.classname + " debug");
	logger.debug.apply(logger, arguments);		
};

ClassUtils.prototype.warn = function() {
	logger.level(this.classname + " warn");
	logger.warn.apply(logger, arguments);		
};

ClassUtils.prototype.err = function() {
	logger.level(this.classname + " err");
	logger.err.apply(logger, arguments);		
};

ClassUtils.prototype.Error = function(name){
	return new code.Error(name)
};

ClassUtils.prototype._createCb = function(callback) {
    if (!callback)
        return null;
    var self = this;
    return function() {
        callback.apply(self, arguments);
    };	
};

ClassUtils.prototype._bindSelf = function(tasks) {
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

ClassUtils.prototype._createFunc = function(task, args) {
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

ClassUtils.prototype.waterfall = function(tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.waterfall(tasks, callback);	
};

ClassUtils.prototype.auto = function(tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.auto(tasks, callback);	
};

ClassUtils.prototype.series = function(tasks, callback) {
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

ClassUtils.prototype.forEachSeries = function(list, tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.forEachSeries(list, tasks, callback);	
};

ClassUtils.prototype.parallel = function(tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.parallel(tasks, callback);	
};

ClassUtils.prototype.map = function(list, tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.map(list, tasks, callback);	
};

ClassUtils.prototype.mapSeries = function(list, tasks, callback) {
    this._bindSelf(tasks);
    callback = this._createCb(callback);
    async.mapSeries(list, tasks, callback);	
};

ClassUtils.prototype.getCallback = function(tasks, callback) {
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

