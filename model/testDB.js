//Mongoose setup for database connections
//need to add property autoIndex as false for better performance
//Create database with name hostelPEB*** 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating a schema with basic validation(Inbuilt in mongoose)
var testSchema = new Schema({

		first_name: String

});


mongoose.createConnection('mongodb://localhost/hostelpeb');
module.exports = mongoose.model('test',testSchema);	


