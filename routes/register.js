module.exports = function(io){
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var verify_ac = mongoose.model('ac', new schema({ roll_num: Number, name: String, Course : String, Branch: String,Passkey:String}, { collection : 'verify_ac' }));
var verify_nac = mongoose.model('nac', new schema({ roll_num: Number, name: String, Course : String, Branch: String,Passkey:String}, { collection : 'verify_nac' }));


router.get('/register', function(req, res) {
  res.render('register');
  //next();
});

var reg_sock = io.of('/register');
 reg_sock.on('connection', function(socket){
 socket.on('verify',function(Roll){
  verify_ac.findOne({'roll_num':Roll},function(err,jone){
    if(jone != null){
      return socket.emit('jone',jone);
    }
    verify_nac.findOne({'roll_num':Roll},function(err,jone){
    if(jone != null){
      return socket.emit('jone',jone);
    }
      //error bitches 
    });
    
   });
});
});




return router;
}
