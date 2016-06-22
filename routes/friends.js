var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../model/configDB');
var bcrypt = require('bcrypt');

router.get('/friends',function(req,res){
   res.render('/friends'); 
});

router.post('/friends',function(req,res){(
       req.checkBody('passkey','Passkey error').notEmpty().isAlphanumeric();
       req.checkBody('comp_passkey','Passkey error').notEmpty().isAlphanumeric(); 
       req.checkBody('password','Password error').notEmpty();       
       req.checkBody('conf_password','Password error').notEmpty().equals(req.body.password);       
       
       var error = req.validationErrors();
       
       if(error) return console.log(error);
       
       req.sanitizeBody('passkey').escape();
       req.sanitizeBody('comp_passkey').escape();
       req.sanitizeBody('password').escape();
       req.sanitizeBody('conf_password').escape();
       
       var passkey = req.body.passkey;
       var comp_passkey = req.body.comp_passkey;
       
       db.findOne({'pass_key':passkey},function(err,student){
           if(err) return console.log(err);
           if(student.comp_pass_key != NULL) return console.log('You are already locked with another user');
           db.findOne({'pass_key':comp_pass_key},function(err2,friend){
               if(err2) return console.log(err2);
               if(friend.comp_pass_key != NULL) return console.log('Your friend is already locked with another user');
                var password_temp = req.body.password;
                var password = bcrypt.hashSync(password_temp /*, salt*/); 
                 //   friend.update({comp_pass_key:})
           }); 
       });
});

module.exports = router;