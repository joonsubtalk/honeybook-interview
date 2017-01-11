var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var router = express.Router();
var	assert = require('assert');
var	request = require('request');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));


// ROUTES
app.get('/', function(req, res) {
	res.sendfile('./index.html');
});

app.use('/', router);

app.listen(app.get('port'), function() {
	console.log('server is running on http://localhost:' + app.get('port'));
});
