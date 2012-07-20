'use strict';

// should not have to do this, but line 7158 of angular
// explicitly checks for a function when an array 
// is an acceptable value for inline injection
var loadDeps = function(dependencyLoader) {
  var resolver = dependencyLoader.buildRouteResolver('js/thing.js');
  return resolver();
};
loadDeps.$inject = ['dependencyLoader'];

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.when('/deferred', {
      template: '<p>Deferred!</p><p ng-bind="text"></p>',
      controller: 'ThingCtrl',
      resolve: {
        loadDeps: loadDeps
      }
    });
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
