var express = require('express'),
	path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, './')));

var server = app.listen(process.env.VCAP_APP_PORT || 3000, function() {
    console.log('Listening on port %d', server.address().port);
});