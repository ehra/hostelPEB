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
 if(req.user){
  res.render('users');
 }else{
  res.redirect('/');
 }
});

//Custom namespace
//Use user_sock everywhere instead of io. User_sock is the users.js instance of the socket io connection.-- 
//--Will connect to only localhost/users
var user_sock = io.of('/users');
 user_sock.on('connection', function(socket){
   var user = io.bliss; 
   var people;

       db3.find(function(err1,rooms){
          if(err1) return console.log(err1);    
          if(user.share_choice == "YES"){
            var newRooms = {
              'rooms':rooms,
              'group':true
            };
            user_sock.emit('rooms',newRooms);
            people=2;
          }else{
            var newRooms = {
              'rooms':rooms,
              'group':false
            };
            user_sock.emit('rooms',newRooms);            
            people=1;
            
          }  
        }); 
      
      
    socket.on('message', function(data){
      console.log(data);
      var x = 2 - people;
      var newData = {
        room:data,
        vaccancy:x,
        group:people,
      };

      user_sock.emit('message',newData);


      db3.findOne({'room_number':data},function(err3,room){
        if(room){
          db3.update({'room_number':data},{'vaccancy':0},function(err4){
            if(err4) return console.log(err4);
          });
        }else{
         var x = 2 - people;
          var room = new db3({
              room_number:data,
              vaccancy:x
          });
          room.save(function(err2){
            if(err2) return console.log(err2);
          });
        }
      
      if(people==2){
      /* Not important
        db2.update({'pass_key1':user.pass_key},{'room_number':data},function(err5){
          if(err5) return console.log(err5);//couldn't book your room
          //your room is booked bye
        });*/
        db.update({'pass_key':user.comp_pass_key},{'room_number':data},function(err6){
          if(err6) return console.log(err6);//couldn't book your room
          //your room is booked bye
        });
        db.update({'pass_key':user.pass_key},{'room_number':data},function(err7){
          if(err7) return console.log(err7);//couldn't book your room
          //your room is booked bye
        });
      }else if(people == 1){
        db.update({'pass_key':user.pass_key},{'room_number':data},function(err8){
          if(err8) return console.log(err8);//couldn't book your room
          //your room is booked bye
        })
      }  
  });
      
    socket.on('disconnect',function(){
    	console.log("User gone!");
    });
 });
 
});  
return router;
}
