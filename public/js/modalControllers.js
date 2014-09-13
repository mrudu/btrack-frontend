'use strict'
/* Modal Controllers */

/* Controller for Timeline Modal. Argument projectId consists of the list of projects. */
function TimelineModalCtrl($scope, $modalInstance, projectId, protitle){
	$scope.title = protitle;
	$scope.timeline = {};
	$scope = timeline2($scope,projectId);
}
function ChartModalCtrl($scope,$modalInstance,projectId,protitle){
	$scope.title = protitle;
	$scope.data = {labels:[],datasets:[{label:"Total Revenue",fillColor:'#00A7C9',strokeColor:'#00697E',highlightFill:'#9AEDFD',highlightStroke:'#00697E',data:[]}]};
	$scope.opt = {'barDatasetSpacing':50}
	projectId.forEach(function(obj){
		$scope.data.labels.push(obj.title.substring(0,5));
		$scope.data.datasets[0].data.push(obj.tot_revenue/10000000);
	});
}
/* Controller for Opportunity Progress Checklist Modal. Here the argument projectId refers to the primary key value of the Project. */
function OPCctrl($scope, $http, $modalInstance, projectId,protitle){
	$scope.title = protitle;
	$scope.propost = {};
	var postData = {'btn':'?project__id='+projectId}
	$http({method: 'POST', url:'/api/filter/opc',data:postData}).
	success(function(data,status,headers,config){
		$scope.propost = data.body.objects[0];
	});
	$scope.submit = function(opcid){
		$http({method:'POST',url:'/api/put/opc/'+opcid+'/',data:$scope.propost}).success(function(data,status,headers,config){
		});
	}
}

/* Controller for Edit Project Modal. Uses the same template as in Create Modal. */
function editctrl($scope, $http, $modalInstance, projectId,protitle){
	$scope.title = protitle;
	$scope.project = {};
	$scope.alerts = [];
	$http({method: 'GET', url: '/api/customer'}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
		$scope.project = projectId;
		$scope.custom = $scope.project.customer;
		$scope.project.life = $scope.project.life-2;
	});
	$scope.cancel = function(){
		$modalInstance.close();
	}
	$scope.suspend = function(projectd,number,index){
		var putData = {'status':number}
		$http({method:'POST',url:'/api/put/project/'+projectd+'/',data:putData})
		.success(function(data,status,headers,config){
			$scope.project.status = number;
		});
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

function taskCtrl($scope, $http, $modalInstance, projectId,protitle){
	$scope.title = protitle.title;
	$scope.status = protitle.status;
	$scope.postTask = {};
	var postData = {'btn':'?project__id='+projectId}
	$http({method:'POST',url:'/api/filter/task/', data:postData })
	.success(function(data, status, headers, config){
		$scope.tasks = data.body.objects;
	});
	$scope.complete = function(taskid,index){
		var putData = {'end_date':today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()};
		$http({method:'POST',url:'/api/patch/task/'+taskid+'/',data:putData})
		.success(function(data,status,headers,config){
			$scope.tasks[index].end_date = today;
		});
	}
	$scope.add = function(){
		$scope.postTask.project = "/api/v1/project/"+projectId+"/";
		$scope.postTask.workflow = "/api/v1/workflow/"+$scope.postTask.workflow+"/";
		$http({method:'POST',url:'/api/task/', data:$scope.postTask })
		.success(function(data, status, headers, config){
			$scope.tasks.push({'due_date':$scope.postTask.due_date,'remarks':$scope.postTask.remarks,'description':$scope.postTask.description,'start_date':today});
			$scope.postTask = {};
		});
	}
}
function remarkCtrl($scope, $http, $modalInstance, projectId,protitle){
	$scope.title = protitle;
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
function CreateCustomerCtrl($scope, $http,$modalInstance,projectId,protitle){
	$scope.title = protitle;
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
