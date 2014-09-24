/* Finds the number of months between two given dates. */
function monthDiff(d1, d2) {
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth() + 1;
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
}
function daysbetween( date1, date2 ) {
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;
	//Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();
	//Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//Convert back to days and return
	return Math.round(difference_ms/one_day);
}
/* Prepares the timeline array for the timeline modal.The input argument should contain a Project datatype. */
function time(obj){
	var max = 0;
	var current = [];
	var due = [];
	var start_date = Date();
	var end_date = Date();
	var due_date = Date();
	var x = obj.tasks.forEach(function(task){
		var currobj ={'value':0,'type':'success','text':'','inc':''};
		start_date = new Date(task.start_date);
		if(task.end_date){
			end_date = new Date(task.end_date);
		} else {
			end_date = today;
			currobj.inc = "progress-striped active";
		}
		max += daysbetween(start_date,end_date)/7.0;
		currobj.value = daysbetween(start_date,end_date)/7.0;
		due_date = new Date(task.due_date);
		switch(task.workflow.id){
			case 1:
				currobj.type = "ENQ";
				break;
			case 2:
				currobj.type = "NBO";
				break;
			case 3:
				currobj.type = "QUOTE";
				break;
			case 4:
				currobj.type = "IPO";
				break;
			case 5:
				currobj.type = "PPAP";
				break;
			case 6:
				currobj.type = "FPO";
				break;
			case 7:
				currobj.type = "FRS";
				break;
		}
		currobj.text = currobj.type;
		current.push(currobj);
	});
	return {'max':max,'current':current,'count':0};
}

function modal(temp, ctrl, projectd,ptitle, $modal,wclass){
	var modalInstance = $modal.open({
		templateUrl: 'partial/'+temp,
	    	controller: ctrl,
	    	windowClass: wclass,
	    	resolve: {
			projectId: function(){
				return projectd;
			},
	    		protitle: function(){
				return ptitle;
			}
		}
	});
}

function switch1(url){
	var postData = {'type':'','message':'','btn':'','hide':false}
	switch(url){
		case "nbo":
			postData.btn = "?tasks__workflow__id=2&tasks__end_date__isnull=True&status=0";
			postData.type= "NBO STAGE";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "quote":
			postData.btn = "?tasks__workflow__id=3&tasks__end_date__isnull=True&status=0";
			postData.type= "QUOTE STAGE";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "ipo":
			postData.btn = "?tasks__workflow__id=4&tasks__end_date__isnull=True&status=0";
			postData.type= "INITIAL PURCHASE ORDER STAGE";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "ppap":
			postData.btn = "?tasks__workflow__id=5&tasks__end_date__isnull=True&status=0";
			postData.type= "PPAP STAGE";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "fpo":
			postData.btn = "?tasks__workflow__id=6&tasks__end_date__isnull=True&status=0";
			postData.type= "FINAL PURCHASE ORDER";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "frs":
			postData.btn = "?tasks__workflow__id=7&tasks__end_date__isnull=True&status=0";
			postData.type= "FRS STAGE";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "enq":
			postData.btn = "?tasks__workflow__id=1&tasks__end_date__isnull=True&status=0";
			postData.type= "ENQUIRY STAGE";
			postData.message = "Projects in "+postData.type+" stage";
			break;
		case "all":
			postData.btn = "?status__gte=0";
			postData.type= "ALL";
			postData.message = "All projects including suspended projects";
			break;
		case "ong":
			postData.btn = "?status=0";
			postData.type= "ON-GOING";
			postData.message = "Projects which are not suspended and whose FRS has not been done.";
			break;
		case "compl":
			postData.btn = "?status=2";
			postData.type= "COMPLETED";
			postData.message = "Projects whose FRS has been done.";
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
			postData.btn = "?product=Oth&status=0";
			postData.message = "Projects in Miscellaneous product category";
			break;
		case "wtc":
			postData.type= "WORLD TRANSFER CASE";
			postData.btn = "?product=WTC&status=0";
			postData.message = "World Transfer Case Projects";
			break;
		case "ace":
			postData.type= "ACE";
			postData.btn = "?product=ACE&status=0";
			postData.message = "Projects in ACE category";
			break;

		case "ntc":
			postData.type= "TRANSFER CASE";
			postData.btn = "?product=NTC&status=0";
			postData.message = "Projects in Transfer Case product category";
			break;
		case "synchro":
			postData.type= "SYNCHRONIZER";
			postData.btn = "?product=Synchro&status=0";
			postData.message = "Projects in Synchronizer product category";
			break;
		case "ptu":
			postData.type= "POWER TRANSFER UNIT";
			postData.btn = "?product=PTU&status=0";
			postData.message = "Projects in Power Transfer Unit product category";
			break;
		case "comp":
			postData.type= "COMPONENTS";
			postData.btn = "?product=Comp&status=0";
			postData.message = "Projects in Component product category";
			break;
		case "lagging":
			postData.type = "LAGGING";
			postData.btn = "?status__lte=1&sopDate__lte="+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			postData.message = "Projects whose Start Of Production date has gone by and Production not yet started";
			break;
	}
	if(postData.type != "TOP TEN"){
	postData.btn += "&limit=100"}
	return postData;
}
