var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Defining Message model
var MessageSchema = new Schema({
	body: {
		type: String,
		required:true
	},
	isEdited:{
		type: Boolean,
		default: false
	},
	display_name:{
		type: String,
		required:true
	},
	created: {
		type: Date,
		default: Date.now
	},
	userId: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Message', MessageSchema);