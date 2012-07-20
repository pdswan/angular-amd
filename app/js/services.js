'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []).
  value('version', '0.1');


services.factory('dependencyLoader',
    [
      '$q', '$log', '$timeout',
      function($q, $log, $timeout) {
        var loader = { };

        function argumentsToArray(args) {
          return Array.prototype.slice.call(args, 0);
        }

        loader.buildRouteResolver = function(/* deps */) {
          var deps = argumentsToArray(arguments);

          return function() {
            var deferred  = $q.defer();
            var promise   = deferred.promise;
            var startTime = new Date().getTime();

            require(deps, function() {
              var endTime = new Date().getTime();
              var modules = argumentsToArray(arguments);

              $log.info('loaded scripts in ' + (endTime - startTime));
              
              // not sure why this is needed, but it looks like 
              // nextTick doesn't get called without it so the 
              // resolution doesn't got through
              $timeout(function() {
                deferred.resolve(modules);
              });
            });
            return deferred.promise;
          };
        };

        return loader;
      }
    ]);

