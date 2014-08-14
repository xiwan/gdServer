module.exports = function(sails) {
	/**
	 * Module dependencies.
	 */

var async = require('async'),
    _ = require('lodash'),
    Waterline = require('waterline'),
    Modules = require('./moduleloader');

function injectPluginModels(connName, cb) {
	var loadUserModelsAndAdapters = require('./loadUserModules')(sails);

	async.auto({
    // 1. load api/models, api/adapters
    _loadModules: loadUserModelsAndAdapters,

    
    modelDefs: ['_loadModules', function(next){
      // 2. Merge additional models, exclude model in hub;
      _.each(sails.models, function(pubginModel, key) {
        if (pubginModel.connection === "mongo_gdHub") {
          return;
        }
        pubginModel.connection = connName;
        // var additionalModel = {};
        // additionalModel[key] = pubginModel
        //  _.merge(sails.models, additionalModel);
      });
      console.log(sails.models)
      // 3. normalize model definitions
      _.each(sails.models, sails.hooks.orm.normalizeModelDef);
      next(null, sails.models);
    }],

		
    instantiatedCollections: ['modelDefs', function(next, stack){
      var modelDefs = stack.modelDefs;
      // 4. Load models into waterline, 
      var waterline = new Waterline();
      _.each(modelDefs, function(modelDef, modelID){
        waterline.loadCollection(Waterline.Collection.extend(modelDef));
      });

      var connections = {};
      _.each(sails.adapters, function(adapter, adapterKey) {
        _.each(sails.config.connections, function(connection, connectionKey) {
          if (adapterKey !== connection.adapter) return;
          connections[connectionKey] = connection;
        });
      });
      // 5. tear down connections, 
      var toTearDown = [];
      _.each(connections, function(connection, connectionKey) {
        toTearDown.push({ adapter: connection.adapter, connection: connectionKey });
      });
      // 6. reinitialize waterline
      async.each(toTearDown, function(tear, callback) {
         sails.adapters[tear.adapter].teardown(tear.connection, callback);
      }, function(){
         waterline.initialize({
           adapters: sails.adapters,
           connections: connections
         }, next)
      });

    }],

    // 7. Expose initialized models to global scope and sails
    _prepareModels: ['instantiatedCollections', function (next, stack) {
      var models = stack.instantiatedCollections.collections || [];
      _.each(models,function eachInstantiatedModel(thisModel, modelID) {

        // Bind context for models
        // (this (breaks?)allows usage with tools like `async`)
        _.bindAll(thisModel);

        // Derive information about this model's associations from its schema
        // and attach/expose the metadata as `SomeModel.associations` (an array)
        thisModel.associations = _.reduce(thisModel.attributes, function (associatedWith, attrDef, attrName) {
          if (typeof attrDef === 'object' && (attrDef.model || attrDef.collection)) {
            var assoc = {
              alias: attrName,
              type: attrDef.model ? 'model' : 'collection'
            };
            if (attrDef.model) {
              assoc.model = attrDef.model;
            }
            if (attrDef.collection) {
              assoc.collection = attrDef.collection;
            }
            if (attrDef.via) {
              assoc.via = attrDef.via;
            }

            associatedWith.push(assoc);
          }
          return associatedWith;
        }, []);

        // Set `sails.models.*` reference to instantiated Collection
        // Exposed as `sails.models[modelID]`
        sails.models[modelID] = thisModel;

        // Create global variable for this model
        // (if enabled in `sails.config.globals`)
        // Exposed as `[globalId]`
        if (sails.config.globals && sails.config.globals.models) {
          var globalName = sails.models[modelID].globalId || sails.models[modelID].identity;
          global[globalName] = thisModel;
        }
      });

      next();
    }]

  }, cb);

}

    return {

    	initialize: function(cb) {
    		sails.on('hook:orm:loaded', function() {
					sails.switchConnection = function (connName, next) {
            if (!connName || connName === "mongo_gdHub") {
              return next();
            }
            // assuming plugin.models holds array of models for this plugin
            // customize for your use case
            
            injectPluginModels(connName, next); 
	          

            // Modules.optional({
            //   dirname   : '/Users/wanxi/Documents/dev/gdgame/gdserver/api/utils/',
            //   filter    : /(World.?)\.(js|coffee)$/
            // }, function modulesLoaded (err, modules) {
            //   if (err) return cb(err);
            //   //var pluginModels = _.pluck( pluckArr, 'model');
            // });
        	}
          cb();
    		});
    	}
    }

}