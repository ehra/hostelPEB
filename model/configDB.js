//Mongoose setup for database connections
//need to add property autoIndex as false for better performance
//Create database with name hostelPEB*** 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating a schema with basic validation(Inbuilt in mongoose)
var studentSchema = new Schema({
	name: {
		first: String,
		last : String,
		//required: true
	},
	
	roll_number: { type:Number, required: true, unique:true },
	
	pass_key: { type: String, required: true, unique:true, /*minlength: x*/ },
	
	pass_word: { type: String,/* required: true, */  unique:true, /*minlength: y*/ },
//Note: Add password hashing here or in register.js using pre function before saving to database

	branch: {
				type:String,
				enum : ['COE','ECE','MEE','EIC','CIE','CHE','MTX','ELE','NONE'],
				default : 'NONE'
	},
	
	birth_date: { 
		type: Date, min: Date('1990-01-01'),
		required: true	
	},
	
	email: {
	//	required: true
	},
	
	phone:{
		mobile: {type: Number,required: true},
		landline: Number,
	},

	address: {
		type: String,
		required: true
	} ,

	parent_detail:{
		father: {
			name: String,
			phone: Number,
		},
		mother: {
			name: String,
			phone: Number,
		},
	},

	blood_group:{
		enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-','DONT_KNOW'],
		//default: 'DONT_KNOW'
	},
	
	photo:String,

	share_choice: Boolean,   //true for twin-sharing basis 

	room_num: String

});


mongoose.connect('mongodb://localhost/hostelpeb');
module.exports = mongoose.model('student',studentSchema);


