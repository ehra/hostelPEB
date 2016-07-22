module.exports = function(io){
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var mongoose = require('mongoose');
Promise.promisifyAll(mongoose);

var schema = mongoose.Schema;
var verify_ac = mongoose.model('ac', new schema({ roll_num: Number, name: String, Course : String, Branch: String,Passkey:String}, { collection : 'verify_ac' }));
var verify_nac = mongoose.model('nac', new schema({ roll_num: Number, name: String, Course : String, Branch: String,Passkey:String}, { collection : 'verify_nac' }));

router.get('/register', function(req, res) {
  res.render('register');
  //next();
});

var reg_sock = io.of('/register');
 reg_sock.on('connection', function(socket){
   console.log("yolo");
  socket.on('verify',function(passkey){
    Promise.props({
       jone_ac : verify_ac.findOne({"Passkey":passkey}).exec(),
       jone_nac : verify_nac.findOne({"Passkey":passkey}).exec()
    })
    .then(function(results){
      if(results.jone_ac!=null){
        console.log("AC");
        socket.emit("jone",results.jone_ac);
        jone.ac = true;
        router.jone = results.jone_ac;
      }else if(results.jone_nac!=null){
        console.log("NAC");
        socket.emit("jone",results.jone_nac);
        jone.ac = false;
        router.jone = results.jone_nac;
      }else{
        //Doesnt exist in database
        console.log("User not found");
      }
    })
    .catch(function(err){
      console.log(err);
    });

  })
 });  
return router;
}
