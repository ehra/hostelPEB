var express = require('express');
var router = express.Router();

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register',function(req,res){
    res.send("hello world");
});

module.exports = router;
