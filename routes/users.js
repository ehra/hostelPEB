module.exports = function(io){
var express = require('express');
var router = express.Router();
var db = require('../model/configDB');
var db2 = require('../model/friendsDB');
var db3 = require('../model/roomsDB');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
Promise.promisifyAll(mongoose);

/* GET users listing. */
router.get('/users', function(req,res,next) {
 if(req.cookies.cpn){
   var id = req.cookies.cpn; 
  res.cookie('cpns',id);    
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
   var id = socket.handshake.headers.cookie.cpns;
   if(id === "dafa3442"){
     var last = false;
     return socket.emit('end',last);
   }
   var people;
   var final_message;
   var user;

  Promise.props({
   student: db.findById(id).exec(),
   group  : db2.findById(id).exec()
  })
  .then(function(result){
    if(result.student != null){
      //console.log("Student"); 
     if(result.student.room_number != null) {
      var last = {
        url:'/lastpage',
        text : '',
       };  
       socket.emit('end',last);       
      return console.log("Already Booked");
     }
    db3.find().exec()
    .then(function(rooms){
          var newRooms = {
            'rooms':rooms,
            'group':false
           };
          console.log(newRooms); 
        socket.emit('rooms',newRooms);
    })
    .catch(function(err1){
    //message = [{"msg":"Some error occured."}];
    //res.render('home',{flash:{messages:message}});          
    socket.emit('lie');
    return console.log("All Rooms Err: "+err1);
    });
    
    socket.on('book_req',function(data){
      console.log("book_req");
      if(data == undefined) return console.log("Undefined");
      db3.findOneAndUpdate({'room_number':data},{'vaccancy':0}).exec()
      .then(function(room){
        if(room){
          var newData = {
            room:    data,
            vaccancy:0,
            group: 1
          };
          //console.log("vaccancy is"+newData.vaccancy);
          user_sock.emit('booked',newData);
        }else{
         //new rooom entry
         var room = new db3({
              room_number:data,
              vaccancy:1
              });
         room.save(function(err2){
            if(err2){
              //final_message = "Error in booking your room. Please contact the administration!";
              //handle error
              socket.emit('lie'); 
              return console.log(err2);
            }
            else{
              var newData = {
                  room:    data,
                  vaccancy:1,
                  group: 1
                }; 
               user_sock.emit('booked',newData);  
              console.log("Room saved");
            }   
         })
        }       
     })
     .catch(function(err2){
       //message = [{"msg":"Some error :("}];
       //res.render('home',{flash:{messages:message}});
       //handle error
       socket.emit('lie');        
       return console.log(err2);
     });
     
     
     db.update({'pass_key':result.student.pass_key},{'room_number':data}).exec()
     .then(function(status){
       if(status.nModified === 1){
        // return success;
        //return console.log("Success");
        var last = {
        url:'/lastpage',
        text : data,
        };  
       socket.emit('end',last);   
       }
     })
     .catch(function(err3){
       //message = [{"msg":"Some error :("}];
       //res.render('home',{flash:{messages:message}});
       socket.emit('lie');          
       return console.log(err3);
     });
    })
      
    }
   
   
    
    /**
     * groups
     */
   
   
   
   else if(result.group != null){
     console.log("Group");
    if(result.group.room_number != null) {
      var last = {
        url:'/lastpage',
        text : '',
       };  
       socket.emit('end',last);
       return console.log("Already Booked");
    }

    db3.find().exec()
    .then(function(rooms){
            var newRooms = {
              'rooms':rooms,
              'group':true
            };
            socket.emit('rooms',newRooms);
    })
    .catch(function(err1){
      //message = [{"msg":"Some error :("}];
      //res.render('home',{flash:{messages:message}});          
      //handle error
      socket.emit('lie');
      return console.log(err1);
    })
    
    socket.on('book_req',function(data){
      
      if(data == undefined) return console.log("Undefined");
         var room = new db3({
              room_number:data,
              vaccancy:0
              });
         room.save(function(err2){
            if(err2){
              //final_message = "Error in booking your room. Please contact the administration!"; 
              //handle error
              socket.emit('lie');
              return console.log(err2);
            }
            else{
              var newData = {
                room: data,
                vaccancy:0,
                group:2
              };
              user_sock.emit('booked',newData)
              console.log("room saved");
           
              db.update({'pass_key':result.group.pass_key1},{'room_number':data}).exec()
              .then(function(jai){
                if(jai.nModified === 1){
                    var last = {
                        url:'/lastpage',
                        text : data,
                    };  
                    socket.emit('end',last)
                    return db.update({'pass_key':result.group.pass_key2},{'room_number':data}).exec()
                }
             })
              .then(function(sholay){
                if(sholay.nModified === 1){
                    return db2.update({'pass_key':result.group.pass_key},{'room_number':data}).exec()
                }         
              })
            .catch(function(err3){
                //message = [{"msg":"Some error :("}];
                //res.render('home',{flash:{messages:message}});          
                //handle error
                socket.emit('lie');
                return console.log(err3);
              });          
             }
          });
      
     
     
    });      
      
      
    }  
    socket.on('disconnect',function(){
      console.log("User gone!");
      socket.disconnect(true); 
    });
       
  })
  .catch(function(dead){
    //refresh
    //handle error
    socket.emit('lie');
    return console.log(dead);
  });
});

return router;
}
