//Mongoose setup for database connections
//need to add property autoIndex as false for better performance
//Create database with name hostelPEB*** 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating a schema with basic validation(Inbuilt in mongoose)
var studentSchema = new Schema({
	name: {
		first: String,
		last : String
	},
	
	roll_number: { type:Number, required: true, unique:true },
	
	pass_key: { type: String, required: true, unique:true, /*minlength: x*/ },
	
	pass_word: { type: String, required: true, unique:true, /*minlength: y*/ },
//Note: Add password hashing here or in register.js using pre function before saving to database

	branch: {
				type:string,
				enum : ['COE','ECE',''],//to add all branches of 2nd year
	},
	
	birth_date: { type: Date, min: Date('1990-01-01') },
	
	email: String,
	
	phone:{
		mobile: Number,
		landline: Number,
	},

	address: {
		permanent: String,
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
	
	room_num: {
		type: string,
		required: true
	}	

});

student = mongoose.model('student',studentSchema);
mongoose.connect('mongodb://localhost/hostelpeb');



