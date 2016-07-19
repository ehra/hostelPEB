//Mongoose setup for database connections
//need to add property autoIndex as false for better performance
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-email');


var studentSchema = new Schema({
	name: {
		first: {type:String,required:true},
		last : {type:String,required:true}
	},
	
	roll_number: { type:Number, required: true, unique:true },
	
	pass_key: { type: String, required: true, unique:true /*,minlength: x*/ },
	
	pass_word: String,

	branch: {
				type:String,
				enum : ['COE','ECE','MEE','EIC','CIE','CHE','MTX','ELE','NONE'],
				default : 'NONE'
	},
	
	birth_date: { 
		type: Date, 
		required: true	
	},
	
	email: {
		 type:mongoose.SchemaTypes.Email,
		 required: true
	},
	
	phone:{
		mobile: {type: Number,required: true},
		landline: Number,
	},

	address: {
		type: String,
		required: true
	},

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
		type: String,
		enum: ['DONTKNOW','A+','A-','B+','B-','O+','O-','AB+','AB-'],
		default: 'DONTKNOW'
	},
	
	photo:{
		type: 	String,
		required:true
	},

	share_choice: {
		type: String,
		enum : ['YES','NO'],
		default : 'NO'
	},   
	
	comp_pass_key: String,
	
	room_number: String

});


mongoose.connect('mongodb://heroku_k1947:tunewhostelmongoose5999@ds013024.mlab.com:13024/heroku_9h01qsh1');
module.exports = mongoose.model('student',studentSchema);


