var mongoose = require('mongoose');
var schema = mongoose.Schema;


var friendSchema = new schema({
    pass_key :{
        type: Number,
        unique: true
    },
    pass_key1:{
        type: String,
        required: true,
        unique: true
    },
    pass_key2:{
        type: String,
        required: true,
        unique: true
    },
    pass_word:{
        type:String,
        required: true
    },

    room_type:{
        type: String,
        enum: ['AC'],
        default: 'AC'
    },
    
    room_number: String},
	{autoIndex:false}
);


module.exports = mongoose.model('friend',friendSchema);