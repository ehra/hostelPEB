//Mongoose setup for database connections

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating a schema
var studentSchema = new Schema({
	name: {
		first: String,
		last : String
	},
	
	roll_number: Number,
	
	pass_key: String,
	
	pass_word: String,

	branch: String,
	
	birth_date: { type: Date, min: Date('1990-01-01') },
	
	email: String,
	
	phone:{
		mobile: Number,
		landline: Number,
	},

	address: {
		permanent: String,

		alternate: String
	},

	parent_detail:{
		father: {
			name: String,
			phone: Number
		},
		mother: {
			name: String,
			phone: Number
		},
	},

	share_choice: Boolean,   //true for twin-sharing basis 
	});

student = mongoose.model('student',studentSchema);
mongoose.connect('mongodb://localhost/hostelpeb');

