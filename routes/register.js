var express = require('express');
var validator = require('express-validator');
var router = express.Router();


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
   // res.render('register', { flash: { type: 'alert-success', messages: [ { msg: 'No errors!' }]}});
   //1. validation through database no repitions of pass_keys*** and rollnumbers***
   //2. insert into database
  }
});

module.exports = router;
