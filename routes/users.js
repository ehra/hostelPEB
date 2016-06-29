module.exports = function(io){
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('users');
});

 io.on('connection', function(socket){
    socket.on('message', function(msg){
      io.emit('message', msg);
  });
});

return router;
}