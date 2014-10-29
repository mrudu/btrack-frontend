'use strict'
/* Modal Controllers */

/* Controller for Timeline Modal. Argument projectId consists of the list of projects. */
function TimelineModalCtrl($scope, $modalInstance, projectId, protitle, $modal){
	$scope.title = protitle;
	$scope.predicate = 'maxv';
	$scope.timeline = {};
	$scope.max_max = 0;
	var foreachcall = projectId.forEach(function(obj){
		var x = time(obj);
		$scope.timeline[obj.title] = {'title':obj.title,'values':x.current, 'maxv':x.max,'id':obj.id,'status':obj.late_status,'customer':obj.customer.name}
		if($scope.max_max < x.max){
			$scope.max_max = x.max+5;
		}
	});
	$scope.task = function(projectd,ptitle,pstatus){
		modal('4','taskCtrl',projectd,{'title':ptitle,'status':pstatus},$modal,'small');
	}
	$scope.order = function(pr){
		console.log(pr);
		$scope.predicate = pr;
		$scope.reverse != $scope.reverse;
	}
}
function BarChartModalCtrl($scope,$modalInstance,projectId,protitle){
	$scope.title = protitle;
	$scope.data = {labels:[],datasets:[{label:"Total Revenue",fillColor:'#00A7C9',strokeColor:'#00697E',highlightFill:'#9AEDFD',highlightStroke:'#00697E',data:[]}]};
	$scope.opt = {'barDatasetSpacing':50}
	projectId.forEach(function(obj){
		$scope.data.labels.push(obj.title.substring(0,5));
		$scope.data.datasets[0].data.push(obj.tot_revenue/10000000);
	});
}
function PieChartModalCtrl($scope,$modalInstance,projectId,protitle){
	$scope.title = protitle;
	$scope.data = [];
	$scope.options = {
		chart: {
			type: 'pieChart',
			height: 1500,
			x: function(d){return d.key;},
			y: function(d){return d.y;},
			showLabels: true,
			showLegend: true,
			labelType: "percent",
			transitionDuration: 500,
			labelThreshold: 0.01,
			tooltips: false,
		}
	}
	projectId.forEach(function(ob){
		$scope.data.push({y:ob.tot_revenue/100000,key:ob.title});
	});
}
function CategoryPieChartModalCtrl($scope,$modalInstance,$http){
	$scope.data = [];
	$http({method:'GET',url:'/api/cpc'})
	.success(function(data,status,headers,config){
		$scope.data.push({y:data.body.ntc,key:'T/c'});
		$scope.data.push({y:data.body.wtc,key:'WTC'});
		$scope.data.push({y:data.body.ptu,key:'PTU'});
		$scope.data.push({y:data.body.syn,key:'Synchro'});
		$scope.data.push({y:data.body.com,key:'Comp'});
		$scope.$apply();
	});
	$scope.options = {
		chart: {
			type: 'pieChart',
			height: 500,
			x: function(d){return d.key+" "+d.y+"% ";},
			y: function(d){return d.y;},
			showLabels: true,
			tooltip:true,
			transitionDuration: 500,
			labelThreshold: 0.01,
			labelType: "percent",
			tooltips: false,
			legend: {
				margin: {
					top: 5,
					right: 35,
					bottom: 5,
					left: 0
				}
			}
		}
	}
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
function editctrl($scope, $http, $modalInstance, projectId,protitle,$modal){
	$scope.title = protitle;
	$scope.projct = {};
	$scope.alerts = [];
	$http({method: 'POST', url: '/api/filter/customer',data:{"btn":"?limit=100"}}).
	success(function(data, status, headers, config){
		$scope.customers = data.body.objects;
		$scope.projct = projectId;
		$scope.createdBy = $scope.projct.createdBy.id;
		$scope.custom = $scope.projct.customer;
		$scope.projct.life = $scope.projct.life-2;
	});
	$scope.cancel = function(){
		$modalInstance.close();
	}
	$scope.suspend = function(projectd,number,index){
		var putData = {'status':number,'late_status':4}
		$http({method:'POST',url:'/api/put/project/'+projectd+'/',data:putData})
		.success(function(data,status,headers,config){
			$scope.projct.status = number;
		});
	}
	$scope.ok = function(createdBy){
		$scope.projct.life = $scope.projct.life+2;
		$scope.projct.createdBy = "/api/v1/user/"+createdBy+"/";
		$scope.projct.customer = "/api/v1/customer/"+$scope.custom.id+"/";
		$http.post('/api/put/project/'+projectId.id, $scope.projct)
		.success(function(){
			$scope.alerts.push({type:'success', msg:'Well done! You\'ve successfully edited the project!'});
			$scope.projct.life = $scope.projct.life-2;
			$scope.projct.createdBy = {'username':'F5 '}
		})
		.error(function(){
			$scope.alerts.push({type:'danger', msg:'Oh snap! Something wierd happened at the server. Change a few things up and try submitting again!'});
		});
	}
	$scope.closeAlert = function(index){
		$scope.alerts.splice(index,1);
	}
	$scope.open = function(){
		modal('5','CreateCustomerCtrl',0,"",$modal,'');
	}

}

function taskCtrl($scope, $http, $modalInstance, projectId,protitle){
	$scope.max_max = 52;
	$scope.title = protitle.title;
	$scope.status = protitle.status;
	$scope.postTask = {};
	$scope.task = {'remarks':''};
	var postData = {'btn':'?project__id='+projectId}
	$http({method:'POST',url:'/api/filter/task/', data:postData })
	.success(function(data, status, headers, config){
		var x = time({'tasks':data.body.objects});
		console.log(x);
		$scope.time = x;
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
	$scope.edit = function(task,txt){
		$scope.task.remarks = txt;
		$http.post('/api/patch/task/'+task+'/', $scope.task)
		.success(function(){
		})
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
