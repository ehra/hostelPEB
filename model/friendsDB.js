var mongoose = require('mongoose');
var schema = mongoose.Schema;


var friendSchema = new schema({
    pass_key :{
        type: String,
        required: true,
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
        enum: ['AC','NAC'],
        default: 'AC'
    },
    
    room_number: String
});


module.exports = mongoose.model('friend',friendSchema);