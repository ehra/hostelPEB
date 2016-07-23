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
   console.log("yolo");
  socket.on('verify',function(passkey){

    verify.findOne({"Passkey":passkey}).exec()
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
 });  
return router;
}
