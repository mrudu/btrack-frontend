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

/* Controller for SalesMatrix Page */
function SaleMatCtrl($scope, $http){
	$http({method: 'GET', url:'/api/salesmanmatrix'}).
	success(function(data, status, headers, config){
		$scope.data = data.body;
	});
}

/* Controller for Summary Page */
function SummaryCtrl($scope, $http,$modal){
	$http({method: 'GET', url:'/api/dashboard'}).
	success(function(data, status, headers, config){
		$scope.dash = data.body;
	});
	$scope.piechart = function(){
		modal('10','CategoryPieChartModalCtrl','blah','Revenue',$modal,'timelinemodal');
	}
}

/* Controller for Reports and Dashboard pages */
function DashboardCtrl($scope, $routeParams,$http, $modal){
	$scope.total1 = 0;
	$scope.total = function(tot){
		$scope.total1 += tot/100000;
	}
	var switchData = switch1($routeParams.project);
	$scope.hide = switchData.hide;
	$scope.message = switchData.message;
	$scope.type = switchData.type;
	var httpcall = $http({method:'POST',url:'/api/filter/project/', data:{'btn':switchData.btn}})
	.success(function(data, status, headers, config){
		$scope.projects = data.body.objects
	});

	$scope.timeline = function(){
		modal('3','TimelineModalCtrl',$scope.projects,switchData.type,$modal,'timelinemodal');
	}
	$scope.piechart = function(){
		modal('10','PieChartModalCtrl',$scope.projects,switchData.type,$modal,'timelinemodal');
	}
	$scope.barchart = function(){
		modal('9','BarChartModalCtrl',$scope.projects,switchData.type,$modal,'timelinemodal');
	}
	$scope.open = function(projectd,ptitle){
		modal('2','remarkCtrl',projectd,ptitle,$modal,'modalclass');
	}
	$scope.edit = function(projectd,ptitle){
		modal('6','editctrl',projectd,ptitle,$modal,'modalclass');
	}
	$scope.task = function(projectd,ptitle,pstatus){
		modal('4','taskCtrl',projectd,{'title':ptitle,'status':pstatus},$modal,'modalclass');
	}
}

/* Controller for Creation of Project */
var CreateProjectCtrl = function($scope, $http, $modal){
	$scope.alerts = [];
	$scope.projct = {};
	$http({method: 'POST', url: '/api/filter/customer',data:{'btn':'?limit=0'}}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
	});
	/* Inserts data into the Database */
	$scope.ok = function() {
		$scope.projct.life = $scope.projct.life+2;
		$scope.projct.createdBy = "/api/v1/user/"+$scope.createdBy+"/";
		$scope.projct.customer = "/api/v1/customer/"+$scope.custom.id+'/';
		console.log($scope.projct.customer);
		$http.post('/api/project', $scope.projct)
		.success(function(){
			$scope.alerts.push({type:'success', msg:'Well done! You\'ve successfully created a project!'});
		})
		.error(function(){
			$scope.alerts.push({type:'danger', msg:'Oh snap! Something wierd happened at the server. Change a few things up and try submitting again!'});
		});
	}
	/* Clears the fields in the form. */
	$scope.cancel = function(){
		$scope.projct = {};
	}
	/* Dismisses the alert */
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}
	/* Opens the Customer modal. */
	$scope.open = function(){
		modal('5','CreateCustomerCtrl',0,"",$modal,'');
	}
}
