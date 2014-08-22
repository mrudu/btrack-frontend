/*
 * Serve JSON to our AngularJS client
 */
var request = require('request-json');
var client = request.newClient("http://localhost:8000/api/v1/");

exports.name = function (req, res) {
  res.json({
  	name: 'Vijay'
  });
};

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
	client.get('project/'+req.body.btn, function(err, resp, body){
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
