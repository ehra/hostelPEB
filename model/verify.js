var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model('verify_ac', new schema({ Sr: Number, roll_num: Number, name: String, Course : String, Branch: String,Passkey:String,room_type:String}, { collection : 'verify' }));