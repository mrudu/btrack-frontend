'use strict';
var today = new Date();
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
function SummaryCtrl($scope, $http){
	$http({method: 'GET', url:'/api/dashboard'}).
	success(function(data, status, headers, config){
		$scope.dash = data.body;
	});
}
function monthDiff(d1, d2) {
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth() + 1;
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
}
function TimelineModalCtrl($scope, $http, projectId) {
	$scope.timeline = {};
	var postData = {'btn':""};
	postData.btn = projectId;	
	$http({method:'POST',url:'/api/filter/task/', data:postData }).
	success(function(data,status,headers,config){
		$scope = timeline($scope,data);
	});
}
function TimelineCtrl($scope,$http){
	$scope.timeline = {}
	$http({method:'GET',url:'/api/project/'}).
	success(function(data,status,headers,config){
		$scope = timeline2($scope,data);
	});
}
function timeline2($scope,data){
	var max = 0;
	var inctext = "";
	$scope.max_max= 0;
	data.body.objects.forEach(function(obj){
		var current = [];
		var start_date= Date();
		var end_date = Date();
		inctext = "";
		obj.tasks.forEach(function(task){
			var currobj ={'value':0,'type':'success','text':''};
			switch(task.workflow.id){
				case 1:
					start_date = new Date(task.start_date);
					inctext = "ENQ->NBO";
					break;
				case 2:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+2;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="info";
					current.push(currobj);
					inctext = "NBO->Q";
					start_date = end_date;
					break;
				case 3:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+2;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="success";
					current.push(currobj);
					inctext = "Q->IPO";
					start_date = end_date;
					break;
				case 4:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+2;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="warning";
					current.push(currobj);
					inctext = "IPO->PPAPSub";
					start_date = end_date;
					break;
				case 5:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+2;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="danger";
					current.push(currobj);
					inctext = "";
					currobj ={'value':0,'type':'success','text':''};
					start_date = end_date;
					if(task.end_date == null){
						currobj.text = "PPAPSub->Appr";
						currobj.value = monthDiff(start_date, today)+2;
						max += currobj.value;
						current.push(currobj);
						return;
					}
					currobj.text = "PPAPSub->Appr";
					end_date = new Date(task.end_date);
					currobj.value = monthDiff(start_date, end_date)+2;
					max += currobj.value;
					current.push(currobj);
					break;
				default:
					return;
			}
		});
		if(inctext != ""){
			var currobj ={'value':0,'type':'success','text':''};
			currobj.value = monthDiff(start_date,today)+2;
			currobj.text = inctext;
			currobj.type="danger";
			current.push(currobj);
		}
		if($scope.max_max<max){
			$scope.max_max = max;
		}
		$scope.timeline[obj.part_no] = {'title':obj.title,'values':current}
		max = 0;
	});
	if(max>$scope.max_max){
		$scope.max_max = max;
	}
	console.log($scope.timeline);
	return $scope;
}

function timeline($scope,data){
	var project = "";
	var current = [];
	var max = 0;
	$scope.max_max= 0;
	data.body.objects.forEach(function(obj){
		var currobj ={'value':0,'type':'success','text':''};
		if(project==""){
			project = obj.project.title;
		}
		if(project!=obj.project.title){
			$scope.timeline[project]={'title':project,'values':current};
			project = obj.project.title;
			current = [];
			if(max>$scope.max_max){
				$scope.max_max = max;
			}
			max=0;
		}
		var start_date = new Date(obj.start_date);
		if(obj.end_date == null){
			currobj.value = monthDiff(start_date,today)+2;
		} else {
			var end_date = new Date(obj.end_date);
			currobj.value = monthDiff(start_date,end_date)+2;
		}
		max+=currobj.value;
		currobj.text  = obj.workflow.name;
		switch(obj.workflow.id){
			case 1:
				currobj.type = "success";
				break;
			case 2:
				currobj.type = "danger";
				break;
			case 3:
				currobj.type = "info";
				break;
			case 4:
				currobj.type="warning";
				break;
			case 5:
				currobj.type="danger";
				break;
			case 6:
				currobj.type="info";
				break;
			case 7:
				currobj.type="warning";
				break;
		}
		current.push(currobj);
	});
	$scope.timeline[project]={'title':project,'values':current};
	console.log(JSON.stringify($scope.timeline));
	if(max>$scope.max_max){
		$scope.max_max = max;
	}
	return $scope;
}
function DashboardCtrl($scope, $routeParams,$http, $modal){
	$scope.total1 = 0; $scope.total2 = 0;
	$scope.sum = function(life,volume,price){
		$scope.total1 += parseInt(life)*parseInt(volume)*parseInt(price);
		$scope.total2 += parseInt(volume)*parseInt(price);
	}
	var postData = {'btn':""};
	var timelinedata = "";
	$scope.hide = false;
	$scope.message = "";
	switch($routeParams.project){
		case "all":
			postData.btn = "";
			$scope.type= "ALL";
			$scope.message = "All projects including suspended projects";
			break;

		case "fp":
			postData.btn = "?winprobability__gte=75&status=0";
			timelinedata = "?project__winprobability__gte=75&project__status=0";
			$scope.type= "FOCUS";
			$scope.message = "Projects whose win probability is greater than 75%";
			break;
		case "h1p":
			postData.btn = "?sopDate__year="+today.getFullYear()+"&status=0";
			$scope.type= "HORIZON 1";
			timelinedata = "?project__sopDate__year="+today.getFullYear()+"&project__status=0";
			$scope.message = "Projects whose SOP Date lies in the current year";
			break;
		case "h2p":
			postData.btn = "?sopDate__year="+(today.getFullYear()+1)+"&status=0";
			$scope.type= "HORIZON 2";
			$scope.message = "Projects whose SOP Date lies in the next year";
			timelinedata = "?project__sopDate__year="+(today.getFullYear()+1)+"2014&project__status=0";
			break;
		case "h3p":
			postData.btn = "?sopDate__gte="+(today.getFullYear()+2)+"-01-01&status=0";
			$scope.type= "HORIZON 3";
			$scope.message = "Projects whose SOP Date lies beyond the next year";
			timelinedata = "?project__sopDate__gte="+(today.getFullYear()+2)+"-01-01&project__status=0";
			break;
		case "npp":
			postData.btn = "?winprobability__lte=10&status=0";
			$scope.type= "NO-PULL";
			$scope.message = "Projects whose win probability is lesser than 10%";
			timelinedata = "?project__winprobability__1te=10&project__status=0";
			break;
		case "sp":
			postData.btn = "?status=1";
			$scope.type= "SUSPENDED";
			$scope.hide = true;
			$scope.message = "Projects which are suspended.";
			timelinedata = "?project__status=1";
			break;
	}
	$http({method:'POST',url:'/api/filter/project/', data:postData })
	.success(function(data, status, headers, config){
		$scope.projects = data.body.objects
	});
	$scope.timeline = function(){
		modal('3','TimelineModalCtrl',timelinedata,$modal,'timelinemodal');
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
function OPCctrl($scope, $http, $modalInstance, projectId){
	$scope.project = {};
	var postData = {'btn':'?project__id='+projectId}
	$http({method: 'POST', url:'/api/filter/opc',data:postData}).
	success(function(data,status,headers,config){
		$scope.project = data.body;
	});
}
function editctrl($scope, $http, $modalInstance, projectId){
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


function ReportCtrl($http,$scope,$modal,$routeParams) {
	$scope.total1 = 0; $scope.total2 = 0;
	$scope.sum = function(life,volume,price){
		$scope.total1 += parseInt(life)*parseInt(volume)*parseInt(price);
		$scope.total2 += parseInt(volume)*parseInt(price);
	}
	var postOpt = {'url':''};
	var postData = {'btn': ""}
	$scope.message = "";
	var timelinedata ="";
	switch($routeParams.report){
		case "top10":
			postOpt.url = '/api/filter/topten/';
			$scope.type= "TOP TEN";
			postData.btn = "?status=0";
			$scope.message = "Top ten projects by revenue";
			break;
		case "oth":
			postOpt.url = '/api/filter/project';
			$scope.type= "MISCELLANOUS CATEGORY";
			postData.btn = "?product=Oth";
			$scope.message = "Projects in Miscellaneous product category";
			timelinedata = "?project__product=Oth";
			break;
		case "wtc":
			postOpt.url = '/api/filter/project';
			$scope.type= "WORLD TRANSFER CASE";
			postData.btn = "?product=WTC";
			$scope.message = "World Transfer Case Projects";
			timelinedata = "?project__product=WTC";
			break;
		case "ace":
			postOpt.url = '/api/filter/project';
			$scope.type= "ACE";
			postData.btn = "?product=ACE";
			$scope.message = "Projects in ACE category";
			timelinedata = "?project__product=ACE";
			break;

		case "tc":
			postOpt.url = '/api/filter/project';
			$scope.type= "TRANSFER CASE";
			postData.btn = "?product=T/c";
			$scope.message = "Projects in Transfer Case product category";
			timelinedata = "?project__product=T/c";
			break;
		case "synchro":
			postOpt.url = '/api/filter/project';
			$scope.type= "SYNCHRONIZER";
			postData.btn = "?product=Synchro";
			$scope.message = "Projects in Synchronizer product category";
			timelinedata = "?project__product=Synchro";
			break;
		case "ptu":
			postOpt.url = '/api/filter/project';
			$scope.type= "POWER TRANSFER UNIT";
			postData.btn = "?product=PTU";
			timelinedata = "?project__product=PTU";
			$scope.message = "Projects in Power Transfer Unit product category";
			break;
		case "comp":
			postOpt.url = '/api/filter/project';
			$scope.type= "COMPONENTS";
			postData.btn = "?product=Comp";
			timelinedata = "?project__product=Comp";
			$scope.message = "Projects in Component product category";
			break;
		case "lagging":
			postOpt.url = '/api/filter/project';
			$scope.type = "LAGGING";
			postData.btn = "?status__lte=1&sopDate__lte="+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			$scope.message = "Projects whose Start Of Production date has gone by and Production not yet started";
			timelinedata = "?project__status__lte=1&project__sopDate__lte="+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

			break;

	}
	$http({method: 'POST', url: postOpt.url, data:postData}).
	success(function(data, status, headers, config){
		$scope.projects = data.body.objects;
	});
	$scope.timeline = function(){
		modal('3','TimelineModalCtrl',timelinedata,$modal,'timelinemodal');
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
