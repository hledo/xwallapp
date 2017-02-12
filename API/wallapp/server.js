var express = require('express');
var app = express();
var port = 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var router = express.Router();
var appRoutes = require('./routes.js')(router);
var appRoutes = require('./routes.js')(router);
var dBaseConfig = require('./config/databaseconfig.js');

//Middleware starts
//Implementing morgan logger for requests
app.use(morgan('dev'));
//Body parser for http requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//Cors for cross-domain requests
app.use(cors());
//Applying the /api prefix to routes
app.use('/api', appRoutes);
//Middleware ends

app.listen(port, function(){
	console.log('Server running on port '+port);
});


