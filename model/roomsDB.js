var mongoose = require('mongoose');
var schema = mongoose.Schema;


var roomSchema = new schema({
    room_number:{ 
            type: String,
            unique: true
        },
    vaccancy: {
        type: Number,
        enum:[0,1,2],
        default:2
    },
    room_type:{
		type: String,
		enum:['AC'],
        default:'AC'
	}},
    {autoIndex:false}
);


module.exports = mongoose.model('room',roomSchema);