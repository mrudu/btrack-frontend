'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
	$http({method: 'GET', url: '/api/name'}).
	success(function(data, status, headers, config) {
		$scope.name = data.name;
	}).
	error(function(data, status, headers, config) {
		$scope.name = 'Error!'
	});
	$scope.click = function(){
		$scope.boolChangeClass = !$scope.boolChangeClass;
	}
}
function MyCtrl1($scope, $http, $modal){
	$scope.open = function(button){
		var modalInstance = $modal.open({
			templateUrl: 'partial/1',
			controller: 'dashboardctrl',
		    	windowClass: 'project-modal',
		    	resolve: {
				btn: function(){
					return button;
				}
			}
		});
	}
}
function dashboardctrl($scope, $modalInstance,$http, btn){
	var postData = {'btn':btn};
	$http({method:'POST',url:'/api/dashboard', data:postData })
	.success(function(data, status, headers, config){
		$scope.projects = data.body.objects
	});
}

function MyCtrl2() {
}
MyCtrl2.$inject = [];

function MyCtrl3($http,$scope) {
	$http({method: 'GET', url: '/api/project'}).
	success(function(data, status, headers, config){
		$scope.projects = data.body.objects;
	});
}

function MyCtrl4($scope, $modal, $log) {
	$scope.isCollapsed1 = true;
	$scope.isCollapsed3 = true;
	$scope.openProject = function(size){
        	var modalInstance = $modal.open({
			templateUrl: 'partial/'+size,
			controller: 'projectctrl',
			size: 'lg',
		    	windowClass: 'project-modal'
		});
	}
	$scope.openCustomer = function(size){
		var modalInstance = $modal.open({
			templateUrl: 'partial/'+size,
			controller: 'customerctrl',
			size: 'lg'
		});
	}
}

var projectctrl = function($scope, $modalInstance, $http){
	$scope.alerts = [];
	$scope.project = {};
	$http({method: 'GET', url: '/api/customer'}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
	});
	$scope.ok = function() {
		$scope.project.life = $scope.project.life+2;
		$scope.project.createdBy = "/api/v1/user/1/";
		$scope.project.customer = "/api/v1/customer/"+$scope.project.customer+'/';
		$http.post('/api/project', $scope.project)
		.success(function(){
			$modalInstance.dismiss('cancel');
		})
		.error(function(){
			$scope.alerts.push({type:'danger', msg:'Oh snap! Change a few things up and try submitting again!'});
		});
	}
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}
}
var customerctrl = function($scope, $modalInstance, $http){
	$scope.alerts = [];
	$scope.customer = {};
	$scope.ok = function() {
		$http.post('/api/customer', $scope.customer)
		.success(function(){
			$modalInstance.dismiss('cancel');
		}).error(function(){
			$scope.alerts.push({type:'danger', msg:'Oh snap! Change a few things up and try submitting again!'});
		});
	}
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}
}
