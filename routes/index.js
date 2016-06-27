module.exports=function(io){

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../model/configDB');
var db2 = require('../model/friendsDB')
var bcrypt = require('bcrypt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home')});

io.on( "connection", function( socket )
{
    console.log( "A user connected" );
});

router.post('/',function(req,res) {
    
    req.checkBody('passkey','Passkey error').notEmpty().isAlphanumeric();
    req.checkBody('password','Password error').notEmpty();
    
    var error = req.validationErrors();
    
    if(error) return console.log(error);
    
    req.sanitizeBody('passkey').escape();
    req.sanitizeBody('password').escape();
    
    var pass_key = req.body.passkey;
    var password = req.body.password;
    
    db.findOne({'pass_key':pass_key},function(err,student){
        if(err) return console.log(err);//wrong roll_number or password;
        if(student.comp_pass_key != "onwait"){
            db2.findOne({'pass_key1':pass_key},function(err2,friend){
                var pass_retrieved = friend.pass_word;
             bcrypt.compare(password, pass_retrieved, function(err3, correct) {
              if(err3) return console.log(err3);
              if(correct){
                  res.redirect('users');

              }
              else{
                   console.log(pass_retrieved);

               }       
             });
           });
        }else{
         var pass_retrieved = student.pass_word;
         bcrypt.compare(password, pass_retrieved, function(err3, correct) {
          if(err3) return console.log(err3);          
          if(correct){
              res.redirect('users');

          }
          else{
              console.log(pass_retrieved);

          }  
            
         });
        }
         
    });
    
});


 return router;
}
