'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.bootstrap','myApp.filters', 'myApp.services', 'myApp.directives','ngRoute','nvd3']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/summary',{templateUrl:'partial/7',controller: SummaryCtrl});
    $routeProvider.when('/dashboard/:project', {templateUrl:'partial/1', controller: DashboardCtrl});
    $routeProvider.when('/report/salesmanmatrix',{templateUrl:'partial/11',controller: SaleMatCtrl});
    $routeProvider.when('/create/project', {templateUrl:'partial/6', controller: CreateProjectCtrl});
    $routeProvider.when('/report/:project', {templateUrl: 'partial/1', controller: DashboardCtrl});
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({redirectTo: '/summary'});
  }]);
