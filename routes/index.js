var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../model/configDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home')});

router.post('/',function(req,res) {
    
    req.checkBody('roll_number','Roll number error').notEmpty().isNumeric();
    req.checkBody('pass_word','Password error').notEmpty();
    
    var error = req.validationErrors();
    
    if(error) return console.log(error);
    
    req.sanitizeBody('roll_number').escape();
    req.sanitizeBody('pass_word').escape();
    
    var roll_number = req.body.roll_number;
    var password = req.body.pass_word;
    
    db.findOne({'roll_number':roll_number},function(err,student){
        if(err) return console.log(err);//wrong roll_number or password;
        var bcrypt = require('bcrypt');
        var pass_retrieved = student.pass_word;
          if(bcrypt.compareSync(pass_retrieved, password)){
              res.redierect('users');
              console.log("success");
          }
          else
              console.log(pass_retrieved);
              console.log("fail");
              //wrong roll_number or password
        
    });
    
    
    
})

module.exports = router;

