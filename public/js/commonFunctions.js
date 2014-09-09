/* Finds the number of months between two given dates. */
function monthDiff(d1, d2) {
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth() + 1;
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
}

/* Prepares the timeline array for the timeline modal.The input argument should contain an array of Projects. */

function timeline2($scope,data){
	var max = 0;
	var inctext = "";
	$scope.max_max= 0;
	var type = "";
	data.forEach(function(obj){
		var current = [];
		var start_date= Date();
		var end_date = Date();
		inctext = "";
		type = "";
		obj.tasks.forEach(function(task){
			var currobj ={'value':0,'type':'success','text':'','inc':''};
			switch(task.workflow.id){
				case 1:
					start_date = new Date(task.start_date);
					inctext = "ENQ->NBO";
					type = "ENQ";
					break;
				case 2:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+1;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="ENQ";
					current.push(currobj);
					inctext = "NBO->Q";
					type = "NBO";
					start_date = end_date;
					break;
				case 3:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+1;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="NBO";
					current.push(currobj);
					inctext = "Q->IPO";
					start_date = end_date;
					type = "QUOTE";
					break;
				case 4:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+1;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="QUOTE";
					current.push(currobj);
					inctext = "IPO->PPAPSub";
					start_date = end_date;
					type = "PPAPSUB";
					break;
				case 5:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+1;
					max += currobj.value;
					currobj.text = inctext;
					currobj.type="PPAPSUB";
					current.push(currobj);
					inctext = "";
					type = "";
					currobj ={'value':0,'type':'success','text':'','inc':''};
					start_date = end_date;
					if(task.end_date == null){
						currobj.text = "PPAPSub->Appr";
						currobj.value = monthDiff(start_date, today)+1;
						currobj.type = "PPAPAPP";
						currobj.inc = 'progress-striped active';
						max += currobj.value;
						current.push(currobj);
						return;
					}
					currobj.text = "PPAPSub->Appr";
					currobj.type = "PPAPAPP";
					end_date = new Date(task.end_date);
					currobj.value = monthDiff(start_date, end_date)+1;
					max += currobj.value;
					current.push(currobj);
					break;
				case 6:
					start_date = new Date(task.start_date);
					inctext = "FPO->FRS";
					type = "FRS";
					break;
				case 7:
					end_date = new Date(task.start_date);
					currobj.value = monthDiff(start_date,end_date)+1;
					currobj.text = inctext;
					currobj.type = "FRS";
					current.push(currobj);
					inctext = "";
					break;
				default:
					return;
			}
		});
		if(inctext != ""){
			var currobj ={'value':0,'type':'success','text':'','inc':'progress-striped active'};
			currobj.value = monthDiff(start_date,today)+1;
			currobj.text = inctext;
			currobj.type=type;
			current.push(currobj);
		}
		if($scope.max_max<max){
			$scope.max_max = max;
		}
		$scope.timeline[obj.part_no] = {'title':obj.title,'values':current}
		max = 0;
	});
	console.log($scope.timeline);
	return $scope;
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

function switch1(url){
	var postData = {'type':'','message':'','btn':'','hide':false}
	switch(url){
		case "all":
			postData.type= "ALL";
			postData.message = "All projects including suspended projects";
			break;

		case "fp":
			postData.btn = "?winprobability__gte=75&status=0";
			postData.type= "FOCUS";
			postData.message = "Projects whose win probability is greater than 75%";
			break;
		case "h1p":
			postData.btn = "?sopDate__year="+today.getFullYear()+"&status=0";
			postData.type= "HORIZON 1";
			postData.message = "Projects whose SOP Date lies in the current year";
			break;
		case "h2p":
			postData.btn = "?sopDate__year="+(today.getFullYear()+1)+"&status=0";
			postData.type= "HORIZON 2";
			postData.message = "Projects whose SOP Date lies in the next year";
			break;
		case "h3p":
			postData.btn = "?sopDate__gte="+(today.getFullYear()+2)+"-01-01&status=0";
			postData.type= "HORIZON 3";
			postData.message = "Projects whose SOP Date lies beyond the next year";
			break;
		case "npp":
			postData.btn = "?winprobability__lte=10&status=0";
			postData.type= "NO-PULL";
			postData.message = "Projects whose win probability is lesser than 10%";
			break;
		case "sp":
			postData.btn = "?status=1";
			postData.type= "SUSPENDED";
			postData.hide = true;
			postData.message = "Projects which are suspended.";
			break;
		case "top10":
			postData.type= "TOP TEN";
			postData.btn = "?status=0&order_by=-tot_revenue&limit=10";
			postData.message = "Top ten projects by revenue";
			break;
		case "oth":
			postData.type= "MISCELLANOUS CATEGORY";
			postData.btn = "?product=Oth";
			postData.message = "Projects in Miscellaneous product category";
			break;
		case "wtc":
			postData.type= "WORLD TRANSFER CASE";
			postData.btn = "?product=WTC";
			postData.message = "World Transfer Case Projects";
			break;
		case "ace":
			postData.type= "ACE";
			postData.btn = "?product=ACE";
			postData.message = "Projects in ACE category";
			break;

		case "tc":
			postData.type= "TRANSFER CASE";
			postData.btn = "?product=T/c";
			postData.message = "Projects in Transfer Case product category";
			break;
		case "synchro":
			postData.type= "SYNCHRONIZER";
			postData.btn = "?product=Synchro";
			postData.message = "Projects in Synchronizer product category";
			break;
		case "ptu":
			postData.type= "POWER TRANSFER UNIT";
			postData.btn = "?product=PTU";
			postData.message = "Projects in Power Transfer Unit product category";
			break;
		case "comp":
			postData.type= "COMPONENTS";
			postData.btn = "?product=Comp";
			postData.message = "Projects in Component product category";
			break;
		case "lagging":
			postData.type = "LAGGING";
			postData.btn = "?status__lte=1&sopDate__lte="+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			postData.message = "Projects whose Start Of Production date has gone by and Production not yet started";
			break;
	}
	return postData;
}
