'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var RaspiCam = require('raspicam');
var app = express();
var camera;
var process_id;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/start', function(req,res){
	console.log('Start timelapse command received');
	var freq = parseInt(req.body.txtInterval);
	console.log("taking pictures every " + freq + " milliseconds");
	var timeout = parseInt(req.body.txtDuration) * 60 * 1000;
	camera = new RaspiCam({
		mode: 'timelapse',
		output: './public/timelapse/image_%06d.jpg',
		encoding: 'jpg',
		timelapse: freq,
		timeout: timeout
	});

	camera.on('start', function(err, timestamp){
		if(err)
			console.error(err);
		else
			console.log('timelapse started at: ' + timestamp);
	});

	camera.on('stop', function(err, timestamp){
		if(err)
			console.err(err);
		else
			console.log('timelapse stopped at: ' + timestamp);
	});

	process_id = camera.start();
	console.log("timelapse running at pid: " + process_id);
	res.redirect('./public/stop.html');
//	res.send("Timelapse running at pid: " + process_id);
});

app.get('/stop', function(req,res){
	camera.stop();
	console.log("timelapse stopped");
	res.send("Timelapse stopped");
});


var server = app.listen(3000, function(){
	var host = server.address().host;
	var port = server.address().port;
	console.log("Listening at: " + host + ":" + port);
});

