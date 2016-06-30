var mongoose = require('mongoose');
var schema = mongoose.Schema;


var roomSchema = new schema({
    room_number: String
});


module.exports = mongoose.model('room',roomSchema);