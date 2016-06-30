module.exports = function(io){
var express = require('express');
var router = express.Router();
var db = require('../model/configDB');
var db2 = require('../model/friendsDB');
var db3 = require('../model/roomsDB');
var jsdom = require('jsdom');
var k = require('jquery');

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('users');
});


 io.on('connection', function(socket){
    db3.find(function(err1,rooms){
      if(err1) return console.log(err1);
      io.emit('rooms',rooms);
    });  
      
    socket.on('chat-message', function(data){
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