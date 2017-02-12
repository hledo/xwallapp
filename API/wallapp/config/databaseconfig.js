//Connecting to mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wallapp', function(err){
	if(err){
		console.log('Error connecting to the database: '+err);
	}else{
		console.log('MongoDB connection successful');		
	}
});