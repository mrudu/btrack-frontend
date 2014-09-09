'use strict';
var today = new Date();
/* Normal Controllers */
/* Runs for every page load */
function AppCtrl($scope, $http) {
	$http({method: 'GET', url: '/api/name'}).
	success(function(data, status, headers, config) {
		$scope.name = data.name;
	}).
	error(function(data, status, headers, config) {
		$scope.name = 'Error!';
	});
	/* Toggles the sidebar */
	$scope.click = function(){
		$scope.boolChangeClass = !$scope.boolChangeClass;
	};
}

/* Controller for Summary Page */
function SummaryCtrl($scope, $http){
	$http({method: 'GET', url:'/api/dashboard'}).
	success(function(data, status, headers, config){
		$scope.dash = data.body;
	});
}

/* Controller for Reports and Dashboard pages */
function DashboardCtrl($scope, $routeParams,$http, $modal){
	$scope.total1 = 0; $scope.total2 = 0;
	$scope.sum = function(year,tot){
		$scope.total1 += tot;
		$scope.total2 += year;
	}
	var switchData = switch1($routeParams.project);
	$scope.hide = switchData.hide;
	$scope.message = switchData.message;
	$scope.type = switchData.type;
	$http({method:'POST',url:'/api/filter/project/', data:{'btn':switchData.btn}})
	.success(function(data, status, headers, config){
		$scope.projects = data.body.objects
	});

	$scope.timeline = function(){
		modal('3','TimelineModalCtrl',$scope.projects,$modal,'timelinemodal');
	}
	$scope.open = function(projectd){
		modal('2','remarkCtrl',projectd,$modal,'modalclass');
	}
	$scope.edit = function(projectd){
		modal('6','editctrl',projectd,$modal,'modalclass');
	}
	$scope.suspend = function(projectd,number,index){
		var putData = {'status':number}
		$http({method:'POST',url:'/api/put/project/'+projectd+'/',data:putData})
		.success(function(data,status,headers,config){
			$scope.projects[index].status = number;
		});
	}
	$scope.opc = function(projectd){
		modal('8','OPCctrl',projectd,$modal,'');
	}
	$scope.task = function(projectd){
		modal('4','taskCtrl',projectd,$modal,'modalclass');
	}
}

/* Controller for Creation of Project */
var CreateProjectCtrl = function($scope, $http, $modal){
	$scope.alerts = [];
	$scope.project = {};
	$http({method: 'GET', url: '/api/customer'}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
	});
	/* Inserts data into the Database */
	$scope.ok = function() {
		$scope.project.life = $scope.project.life+2;
		$scope.project.createdBy = "/api/v1/user/1/";
		$scope.project.customer = "/api/v1/customer/"+$scope.custom.id+'/';
		console.log($scope.project.customer);
		$http.post('/api/project', $scope.project)
		.success(function(){
			$scope.alerts.push({type:'success', msg:'Well done! You\'ve successfully created a project!'});
		})
		.error(function(){
			$scope.alerts.push({type:'danger', msg:'Oh snap! Something wierd happened at the server. Change a few things up and try submitting again!'});
		});
	}
	/* Clears the fields in the form. */
	$scope.cancel = function(){
		$scope.project = {};
	}
	/* Dismisses the alert */
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}
	/* Opens the Customer modal. */
	$scope.open = function(){
		modal('5','CreateCustomerCtrl',0,$modal,'');
	}
}
