module.exports = function(io){
var express = require('express');
var router = express.Router();
var db = require('../model/configDB');
var db2 = require('../model/friendsDB');
var db3 = require('../model/roomsDB');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
   
   var id = socket.handshake.headers.cookie.cpn;
   if(id === "dafa3442"){
     var last = false;
     return socket.emit('end',last);
   }
   var people;
   var final_message;
   var user;
   db.findById(id,function(err0,user){

       db3.find(function(err1,rooms){
        console.log("First Run")
          if(err1) return console.log(err1);    
          if(user.share_choice == "YES"){
            var newRooms = {
              'rooms':rooms,
              'group':true
            };
            //Why using user_sock here?
            socket.emit('rooms',newRooms);
            people=2;
          }else{
            var newRooms = {
              'rooms':rooms,
              'group':false
            };
            //Why using user_sock here?
            socket.emit('rooms',newRooms);            
            people=1;
          }  
        }); 
      
      var x;
    socket.on('book_req', function(data){
      //var status = db3.find({'room_number': data}).limit(1).size();
      console.log(data);
      if (status.length > 0) {
        x = 1 - people; 
      }
        else{
        x = 2 - people;
      }
      var newData = {
        room:data,
        vaccancy:x,
        group:people,
      };

      user_sock.emit('booked',newData);


      db3.findOne({'room_number':data},function(err3,room){
        if(room){
          if(room.vaccancy!=0 && people !=2){
          db3.update({'room_number':data},{'vaccancy':0},function(err4){
            if(err4) return console.log(err4);
          });
          db.update({'pass_key':user.pass_key},{'room_number':data},function(err8){
          if(err8) return console.log(err8);//couldn't book your room
          //your room is booked bye
          final_message = "Your room" + data + ", has been booked!";     
          });
            data = null;
          }else{
            data = null;
            //this room is already booked
          }
        
       }
       else{
           //new rooom entry
         var x = 2 - people;
          var room = new db3({
              room_number:data,
              vaccancy:x
          });
          room.save(function(err2){
            if(err2){
              final_message = "Error in booking your room. Please contact the administration!"; 
              return console.log(err2);
            }
            //final_message = "Your room :" + data + ", has been booked! Success!";
          });
         if(people==2){
         /* Not important
         db2.update({'pass_key1':user.pass_key},{'room_number':data},function(err5){
          if(err5) return console.log(err5);//couldn't book your room
          //your room is booked bye
         });*/

          db.update({'pass_key':user.comp_pass_key},{'room_number':data},function(err6){
          if(err6) return console.log(err6);//couldn't book your room
           final_message = "Your room" + data + ", has been booked for the group!";
           });
          db.update({'pass_key':user.pass_key},{'room_number':data},function(err7){
          if(err7) return console.log(err7);//couldn't book your room
          //your room is booked bye
           final_message = "Your room" + data + ", has been booked for the group!";
           });
        }
         else if(people == 1){
        db.update({'pass_key':user.pass_key},{'room_number':data},function(err8){
          if(err8) return console.log(err8);//couldn't book your room
          //your room is booked bye
           final_message = "Your room" + data + ", has been booked!";     
        });

         }  
        }
      });

       var last = {
        url:'/lastpage',
        text : data,
       };  
       socket.emit('end',last);   
  });
      
    socket.on('disconnect',function(){
      console.log("User gone!");
      socket.disconnect(true); 
    });

 
  });  
});
return router;
}
