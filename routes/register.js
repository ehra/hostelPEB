module.exports = function(io){
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var verify_ac = mongoose.model('ac', new schema({ roll_num: Number, name: String, Course : String, Branch: String,Passkey:String}, { collection : 'verify_ac' }));
var verify_nac = mongoose.model('nac', new schema({ roll_num: Number, name: String, Course : String, Branch: String,Passkey:String}, { collection : 'verify_nac' }));


router.get('/register', function(req, res) {
  res.render('register');
  //next();
});


var reg_sock = io.of('/register');
 reg_sock.on('connection', function(socket){
 socket.on('verify',function(passkey){
     
verify_ac.findOne({'pass_key':passkey}).exec()
  .then(function(jone){
    if(jone != null){
      return socket.emit('jone',jone);
    }else{
      verify_nac.findOne({'pass_key':passkey}).exec()
      .then(function(jone){
        if(jone != null){
          return socket.emit('jone',jone);
      }
        //passkey not in db (clear value in input box)     
      })
    }    
  })
  .catch(function(err){
   //error 
  })    
   });
});

 



return router;
}
