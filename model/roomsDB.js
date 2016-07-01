var mongoose = require('mongoose');
var schema = mongoose.Schema;


var roomSchema = new schema({
    room_number: String,
    vaccancy: {
        type: Number,
        enum:[0,1,2],
        default:2
    }
});


module.exports = mongoose.model('room',roomSchema);