//Mongoose setup for database connections
//need to add property autoIndex as false for better performance
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-email');


var studentSchema = new Schema({
	name: {
		type:String,
		required:true
	},
	
	roll_number: { type:Number, required: true, unique:true },
	
	pass_key: { type: String, required: true, unique:true},
	
	pass_word: String,

	branch: {
				type:String,
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
		
	share_choice: {
		type: String,
		enum : ['YES','NO'],
		default : 'NO'
	},   
	
	room_type:{
		type: String,
		enum:['AC'],
		default:'AC'
	},
	
	comp_pass_key: String,
	
	room_number: String},
	{autoIndex:false}
);

var urifields = 'mongodb://virat:virat@ds029725.mlab.com:29725/heroku_7bd16sqz';
mongoose.connect(urifields, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});
module.exports = mongoose.model('student',studentSchema);


