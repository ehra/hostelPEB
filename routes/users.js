module.exports = function(io){
var express = require('express');
var router = express.Router();
var db = require('../model/configDB');
var db2 = require('../model/friendsDB');
var db3 = require('../model/roomsDB');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

/* GET users listing. */
router.get('/users', function(req, res, next) {
 if(!req.user){
   res.redirect('/');
 }else{
  res.render('users');
 }
});

 io.on('connection', function(socket){
     console.log("A user connected")
     //socket.handshake.session=socket.handshake.sessionID;    
     //console.log(io.bliss);
     var user = io.bliss;
     //check group or not
     //if group send message full book
        //check if empty
        
     //else keep 1 vaccany
     
    db3.find(function(err1,rooms){
      if(err1) return console.log(err1);
      io.emit('rooms',rooms);
    });  
      
    socket.on('chat-message', function(data){
      //console.log("Shit works!" + data);
      io.emit('chat-message', data);
      var book = new db3({
        room_number:data
      });
      book.save(function(err2){
        if(err2) return console.log(err2);
      });
      
    });
    socket.on('disconnect',function(){
    	console.log("User gone!");
    });
 });
 
       
return router;
}