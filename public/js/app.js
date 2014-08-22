'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.bootstrap','myApp.filters', 'myApp.services', 'myApp.directives','ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partial/7', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partial/2', controller: MyCtrl2});
    $routeProvider.when('/view3', {templateUrl: 'partial/3', controller: MyCtrl3});
    $routeProvider.when('/view4', {templateUrl: 'partial/4', controller: MyCtrl4});
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
