module.exports = function(io){
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
Promise.promisifyAll(mongoose);
var verify = require('../model/verify');

router.get('/register', function(req, res) {
  res.render('register');
  //next();
});

var reg_sock = io.of('/register');
 reg_sock.on('connection', function(socket){
   console.log("New User!!");
  socket.on('verify',function(rollnum){
    verify.findOne({"roll_num":rollnum,}).exec()
   .then(function(results){
      if(results!=null){
        socket.emit("jone",results);
      }else{
        //Doesnt exist in database
        console.log("User not found");
      }
    })
    .catch(function(err){
      console.log(err);
    });

  })
  
  socket.on('disconnect',function(){
      console.log("User gone!");
      socket.disconnect(true); 
    });
  

});  
 
 
return router;
}
