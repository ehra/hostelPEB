var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var db = require('../model/testDB');

router.get('/testreg', function(req, res, next) {
  res.render('testreg');
  next();
});

router.post('/testreg',function(req,res){

    //validating the input by user->laugh with everyone trust no one.
    req.checkBody('first','First Name error').notEmpty();
    

var errors = req.validationErrors();


  if (errors) {
   // res.render('testreg', { flash: { type: 'alert-danger', messages: errors }});
   // handling error messages***
  }
  else {
   
    var first_name = req.body.first_name;
        
    var student = new db({
                                first: first_name
                         }); 
    
  student.save(function (err) {
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
