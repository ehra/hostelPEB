var express = require('express');
var router = express.Router();

router.post('/success',function(req,res){
    res.render('success', { flash :{ message: req.finale}}); 
});
