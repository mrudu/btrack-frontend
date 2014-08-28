'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.bootstrap','myApp.filters', 'myApp.services', 'myApp.directives','ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/dashboard/:project', {templateUrl:'partial/1', controller: DashboardCtrl});
    $routeProvider.when('/create/project', {templateUrl:'partial/6', controller: CreateProjectCtrl});
    $routeProvider.when('/report/:report', {templateUrl: 'partial/1', controller: ReportCtrl});
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({redirectTo: '/report/1'});
  }]);
