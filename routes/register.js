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

var jone_ac,
var jone_nac;
var reg_sock = io.of('/register');
 reg_sock.on('connection', function(socket){
  socket.on('verify',function(passkey){
    Promise.props({
       jone_ac : verify_ac.findOne({"Passkey":passkey}).exec(),
       jone_nac : verify_nac.findOne({"Passkey":passkey}).exec()
    })
    .then(function(results){
      if(results.jone_ac!=null){
        console.log("AC");
        socket.emit("jone",results.jone_ac);
      }else if(results.jone_nac!=null){
        console.log("NAC");
        socket.emit("jone",results.jone_nac);
      }else{
        //Doesnt exist in database
        console.log("User not found");
      }
    })
    .catch(function(err){
      console.log(err);
    });

  /*   
  verify_ac.findOne({'Passkey':'passkey'}).exec()
    .then(function(jone){
      if(jone != null){
        return socket.emit('jone',jone);
      }
    }).then(verify_nac.findOne({'Passkey':passkey}).exec()
        function(jone){
          if(jone != null){
            return socket.emit('jone',jone);
          }
        }
      //passkey not in db (clear value in input box)
        console.log("Passkey not found");    
      )
  .catch(function(err){
    console.error(error+"shit");        
  })*/
  })
 });  


 



return router;
}
