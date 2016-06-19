var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var db2= require('../model/testDB');

router.get('/testreg', function(req, res, next) {
  res.render('testreg');
  next();
});

router.post('/testreg',function(req,res){

    req.checkBody('first_name','First Name error').notEmpty();
    
var errors = req.validationErrors();


  if (errors) {
   // res.render('testreg', { flash: { type: 'alert-danger', messages: errors }});
  }
  else {

    var first_name = req.body.first_name;
        
    var test = new db2({
                                first_name: first_name
                         }); 
    
  test.save(function (err) {
  if (err) {
		return err;
  }
  else {
  	console.log("Student saved");
  }
});
  }
});


module.exports = router;
