var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var db = require('../model/configDB');

router.get('/register', function(req, res, next) {
  res.render('register');
  next();
});

router.post('/register',function(req,res){

    //validating the input by user->laugh with everyone trust no one.
    req.checkBody('first_name','First Name error').notEmpty().isAlpha();
    req.checkBody('last_name','Last Name error').notEmpty().isAlpha();
    req.checkBody('pass_key','Pass Key error').notEmpty().isAlphanumeric();
    req.checkBody('roll_num','Roll Number error').notEmpty().isNumeric().isLength(9);
    req.checkBody('dob','Date of Birth error').notEmpty().isDate();
    req.checkBody('mob_num','Mobile number error').notEmpty().isNumeric().isMobilePhone("en-IN");

var errors = req.validationErrors();


  if (errors) {
   // res.render('register', { flash: { type: 'alert-danger', messages: errors }});
   // handling error messages***
  }
  else {
   
    var firstname = req.body.first_name;
    var lastname = req.body.last_name;
    var passkey = req.body.pass_key;
    var rollnum = req.body.roll_num;
    var dateofbirth = req.body.dob;
    var mobnum = req.body.mob_num;
    
   var student = new db({
                           first_name:firstname,
                           last_name :lastname,
                           pass_key  :passkey,
                           roll_num  :rollnum,
                           dob       :dateofbirth,
                           mob_num   :mobnum
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
