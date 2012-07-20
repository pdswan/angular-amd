'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []).
  value('version', '0.1');


services.factory('dependencyLoader',
    [
      '$q', '$log', '$rootScope',
      function($q, $log, $rootScope) {
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
              
              // according to https://groups.google.com/forum/#!topic/angular/9YhZOZISHrU
              // this is the accepted way to do this. gnarly.
              $rootScope.$apply(function() {
                deferred.resolve(modules);
              });
            });
            return deferred.promise;
          };
        };

        return loader;
      }
    ]);

