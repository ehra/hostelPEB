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
     var user = io.bliss;

        db3.find(function(err1,rooms){
          if(err1) return console.log(err1);    
          if(user.share_choice == "YES"){
            rooms['0'].group=true;
          }else{
            rooms['0'].group=false;                      
          }  
          io.emit('rooms',rooms);
        });   

     //can be optimized
      var vac;
      if(user.share_choice=="YES"){
        vac = 2;
      }else{
        vac = 1;
      }      
      
    socket.on('book', function(data){
      io.emit('book', data);

      db3.findOne({room_number:data},function(err3,room){
          vac = room.vaccancy-vac;
        if(room){
          db3.update({room_number:data},{vaccancy:vac},function(err4){
            if(err4) return console.log(err4);
          });
        }else{
          var book = new db3({
              room_number:data,
              vaccancy:vac
          });
          book.save(function(err2){
            if(err2) return console.log(err2);
          });
        }
      
      if(user.share_choice=="YES"){
        db2.update({pass_key1:user.pass_key},{room_number:data},function(err5){
          if(err5) return console.log(err5);//couldn't book your room
          //your room is booked bye
        })
      }else{
        db.update({pass_key:user.pass_key},{room_number:data},function(err6){
          if(err6) return console.log(err6);//couldn't book your room
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
