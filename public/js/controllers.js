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
function DashboardCtrl($scope, $routeParams,$http, $modal){
	var postData = {'btn':""};
	$scope.hide = false;
	switch($routeParams.project){
		case "fp":
			postData.btn = "?winprobability__gte=60&status=0";
			$scope.type= "FOCUS";
			break;
		case "h1p":
			postData.btn = "?sopDate__year=2014&status=0";
			$scope.type= "HORIZON 1";
			break;
		case "h2p":
			postData.btn = "?sopDate__year=2015&status=0";
			$scope.type= "HORIZON 2";
			break;
		case "h3p":
			postData.btn = "?sopDate__gte=2016-01-01&status=0";
			$scope.type= "HORIZON 3";
			break;
		case "npp":
			postData.btn = "?winprobability__lte=10&status=0";
			$scope.type= "NO-PULL";
			break;
		case "sp":
			postData.btn = "?status=1";
			$scope.type= "SUSPENDED";
			$scope.hide = true;
			break;
	}
	$http({method:'POST',url:'/api/filter/project/', data:postData })
	.success(function(data, status, headers, config){
		$scope.projects = data.body.objects
	});
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
			$scope.projects.splice(index,1);
		});
	}
}
function modal(temp, ctrl, projectd, $modal,wclass){
	var modalInstance = $modal.open({
		templateUrl: 'partial/'+temp,
	    	controller: ctrl,
	    	windowClass: wclass,
	    	resolve: {
			projectId: function(){
				return projectd;
			}
		}
	});
}

function editctrl($scope, $http, $modalInstance, projectId){
	$scope.project = {};
	$scope.alerts = [];
	var postData = {'btn':projectId+"/"};
	$http({method: 'GET', url: '/api/customer'}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
		$http({method:'POST',url:'/api/filter/project/',data:postData})
		.success(function(data, status, headers, config){
			$scope.project = data.body;
			$scope.custom = $scope.project.customer;
			$scope.project.life = $scope.project.life-2;
		});
	});
	$scope.cancel = function(){
		$modalInstance.close();
	}
	$scope.ok = function(){
		$scope.project.life = $scope.project.life+2;
		$scope.project.createdBy = "/api/v1/user/1/";
		$scope.project.customer = "/api/v1/customer/"+$scope.custom.id+'/';
		console.log($scope.project.customer);
		$http.post('/api/put/project/'+projectId, $scope.project)
		.success(function(){
			$scope.alerts.push({type:'success', msg:'Well done! You\'ve successfully edited the project!'});
			$scope.project.life = $scope.project.life-2;
		})
		.error(function(){
			$scope.alerts.push({type:'danger', msg:'Oh snap! Something wierd happened at the server. Change a few things up and try submitting again!'});
		});
		console.log($scope.project.customer);
	}
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}

}
function taskCtrl($scope, $http, $modalInstance, projectId){
	$scope.postTask = {};
	var postData = {'btn':'?project__id='+projectId}
	$http({method:'POST',url:'/api/filter/task/', data:postData })
	.success(function(data, status, headers, config){
		$scope.tasks = data.body.objects;
	});
	$scope.add = function(){
		$scope.postTask.project = "/api/v1/project/"+projectId+"/";
		$scope.postTask.workflow = "/api/v1/workflow/"+$scope.postTask.workflow+"/";
		$scope.postTask.end_date = $scope.postTask.due_date;
		$http({method:'POST',url:'/api/task/', data:$scope.postTask })
		.success(function(data, status, headers, config){
		});
	}
}
function remarkCtrl($scope, $http, $modalInstance, projectId){
	$scope.postRemark = {};
	var postData = {'btn': "?project__id="+projectId}
	$http({method:'POST',url:'/api/filter/remark/', data:postData })
	.success(function(data, status, headers, config){
		$scope.remarks = data.body.objects;
	});
	$scope.submit = function(){
		$scope.postRemark.createdBy = "/api/v1/user/1/";
		$scope.postRemark.project = "/api/v1/project/"+projectId+"/";
		$http({method:'POST',url:'/api/remark/', data:$scope.postRemark })
		.success(function(data, status, headers, config){
			$scope.remarks.push({'content':$scope.postRemark.content});
			$scope.postRemark.content = '';
		});
	}
	$scope.cancel = function(){
		$modalInstance.close();
	}
}

function MyCtrl2() {
}
MyCtrl2.$inject = [];

function ReportCtrl($http,$scope,$modal,$routeParams) {
	var postOpt = {'url':'','method':''};
	var postData = {'btn': ""}
	switch($routeParams.report){
		case "all":
			postData.btn = "?status=0";
			postOpt.url = "/api/filter/project";
			postOpt.method='POST';
			$scope.type= "On-Going";
			break;
		case "top10":
			postOpt.url = '/api/topten/';
			$scope.type= "TOP TEN";
			postOpt.method = 'GET';
			postData = null;
			break;
	}
	$http({method: postOpt.method, url: postOpt.url, data:postData}).
	success(function(data, status, headers, config){
		$scope.projects = data.body.objects;
	});
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
			$scope.projects.splice(index,1);
		});
	}
	$scope.task = function(projectd){
		modal('4','taskCtrl',projectd,$modal,'modalclass');
	}
}

var CreateProjectCtrl = function($scope, $http, $modal){
	$scope.alerts = [];
	$scope.project = {};
	$http({method: 'GET', url: '/api/customer'}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
	});
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
	$scope.cancel = function(){
		$scope.project = {};
	}
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}
	$scope.open = function(){
		modal('5','CreateCustomerCtrl',0,$modal,'');
	}
}
function CreateCustomerCtrl($scope, $http,$modalInstance,projectId){
	$scope.alerts = [];
	$scope.customer = {};
	$scope.ok = function() {
		$http.post('/api/customer', $scope.customer)
		.success(function(){
			$scope.alerts.push({type:'success', msg:'Well done! You\'ve successfully created a customer'});
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
