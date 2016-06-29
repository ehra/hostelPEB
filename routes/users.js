module.exports = function(io){
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('users');
});

 io.on('connection', function(socket){
 	console.log("This works in users.js");
    socket.on('chat-message', function(data){
    	console.log(data);
    	//var msg = data + "Has been booked!";
    io.emit('message', data);
  });
    socket.on('disconnect',function(){
    	console.log("User gone!");
    });
});

return router;
}