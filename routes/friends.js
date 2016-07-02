
    
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../model/configDB');
var db2 = require('../model/friendsDB')
var bcrypt = require('bcryptjs');

router.get('/friends',function(req,res){
   res.render('friends');
});

router.post('/friends',function(req,res){
    
       req.checkBody('passkey','Passkey error').notEmpty().isAlphanumeric();
       req.checkBody('comp_passkey','Passkey error').notEmpty().isAlphanumeric(); 
       req.checkBody('password','Password error').notEmpty();       
       req.checkBody('conf_password','Password error').notEmpty().equals(req.body.password);       
       
       var errors = req.validationErrors();
       
        if (errors) {
        //error messages graveyard † 
          console.log(errors);
          res.render('friends', { flash: { messages: errors }});
        }
       
      var lull = req.sanitizeBody('passkey').escape();
       req.sanitizeBody('comp_passkey').escape();
       req.sanitizeBody('password').escape();
       req.sanitizeBody('conf_password').escape();
       
       
       var passkey = req.body.passkey;
       var comp_passkey = req.body.comp_passkey;
       
       db.findOne({'pass_key':passkey},function(err,student){
           if(student.share_choice=="YES"){
           if(err) return console.log(err);//you are not registered
           if(student.comp_pass_key != "onwait") return console.log('You are already locked with another user');
           
           db.findOne({'pass_key':comp_passkey},function(err2,friend){
               
               if(err2) return console.log(err2);
               if(friend.comp_pass_key != "onwait") return console.log('Your friend is already locked with another user');
                
                 db.update({'pass_key':passkey},{'comp_pass_key':comp_passkey},function(err3){
                   
                    if(err3) return console.log("Sorry");
                   
                    db.update({'pass_key':comp_passkey},{'comp_pass_key':passkey},function(err4){
                      
                       if(err4) return console.log("Sorry to friend");
                     
                       var password_temp = req.body.password;
                      
                     bcrypt.hash(password_temp, saltRounds, function(err, hash) {
                         
                            if(err) return console.log("Unable to process request");
                            var friend = new db2({
                                    pass_key1:passkey,
                                    pass_key2:comp_passkey,
                                    pass_word:hash
                             });
                            friend.save(function(err5){
                                    if(err5) return console.log("Couldn't Register");
                            }) ;
                     });
                       
                    });
                 });
                 
           }); 
           }else{
             //you chose to be alone
           }
       });
});

module.exports = router;
