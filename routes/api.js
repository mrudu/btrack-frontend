/*
 * Serve JSON to our AngularJS client
 */
var request = require('request-json');
var client = request.newClient("http://localhost:8000/api/v1/");

exports.name = function (req, res) {
	client.get('statusupdate/',function(err,resp,body){
	});
	res.json({
		name: 'Vijay'
	});
};

exports.report = function(req,res){
	client.get('report/'+req.params.id+'/',function(err,resp,body){
		try{
			console.log(JSON.stringify(resp.statusCode));
			res.json({
				body: body
			});
		} catch(e){
			console.log('404 Error. Server not found');
			res.json({
				body: '404'
			});
		}
	});
}

exports.getmodeldata = function(req, res){
	client.get(req.params.djmodel+'/', function(err, resp, body){
		try{
		console.log(JSON.stringify(resp.statusCode));
		res.json({
			body: body
		});
		} catch(e){
			console.log('404 Error. Server not found');
			res.json({
				body: '404'
			});
		}
	});
}
exports.postmodeldata = function(req,res){
	var postData = req.body;
	console.log(JSON.stringify(req.body));
	client.post(req.params.djmodel+'/',postData, function(err, resp, body){
		try{
			console.log(JSON.stringify(resp.statusCode));
			res.json({
				body: resp.statusCode
			});
		} catch(e){
			res.json({
				body: '404'
			});
		}
	});
}
exports.dashboard = function(req, res){
	client.get(req.params.djmodel+'/'+req.body.btn, function(err, resp, body){
		try{
			console.log(JSON.stringify(resp.statusCode));
			res.json({
				body: body
			});
		} catch(e){
			res.json({
				body: '404'
			});
		}
	});
}
exports.putmodeldata = function(req, res){
	var postData =req.body;
	client.put(req.params.djmodel+'/'+req.params.id+'/', postData, function(err, resp, body){
		try{
			console.log(JSON.stringify(resp.statusCode));
			res.json({
				body: resp.statusCode
			});
		} catch(e){
			res.json({
				body: '404'
			});
		}
	});
}
exports.patchmodeldata = function(req, res){
	var postData =req.body;
	client.patch(req.params.djmodel+'/'+req.params.id+'/', postData, function(err, resp, body){
		try{
			console.log(JSON.stringify(resp.statusCode));
			res.json({
				body: resp.statusCode
			});
		} catch(e){
			res.json({
				body: '404'
			});
		}
	});
}
