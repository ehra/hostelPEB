var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
Promise.promisifyAll(mongoose);
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

       var message;

       db.findOne({'pass_key':passkey}).exec()
        .then(function(student){
          if(student.share_choice == "YES" && student.comp_pass_key == "onwait"){
            //Check for AC/Non AC in ConfigDB. If no property present, add property for this.
            return  db.findOne({'pass_key': comp_passkey}).exec()
          }
          else if(student.share_choice != "YES"){
            //Share choice is no or not registered
            message = [{"msg":"You have chosen to apply individually."}]
            res.render('friends',{flash:{messages:message}});
          }
          else{
            //Already locked with another user
            message = [{"msg":'Sorry! You are already locked with another user.'}];
            res.render('friends',{flash: {messages:message}});
          }
        })
        .then(function(friend){
          if(friend === undefined) return console.log("nope");
          var ac_check2;
            if(friend.share_choice === "YES" && friend.comp_pass_key === "onwait" && friend.ac === student.ac){
               db.update({'pass_key':passkey},{'comp_pass_key':comp_passkey}).exec()
               .then(function(student){
                console.log(student.first_name + "Updated");
                return db.update({'pass_key':comp_passkey},{'comp_pass_key':passkey}).exec()
               })
               .then(function(friend){
                console.log(friend.first_name + "Updated");
                //New Passkey Generation
                var new_passkey  = passkey + comp_passkey;   // Just for the sake of an example
                 var password_temp = req.body.password;
  bcrypt.genSalt(10,function(err5,saltRounds){
    if(err5) return console.log("sorry");
    bcrypt.hash(password_temp, saltRounds, function(err6, hash) {
      if(err6) return console.log("Unable to process request");
      var friend = new db2({
                    pass_key:new_passkey,
                    pass_key1:passkey,
                    pass_key2:comp_passkey,
                    pass_word:hash
                  });
      friend.save(function(err7){
        //Registration Unsuccessful.
        if(err7) return console.log("Couldn't Register");
      }) ;
    });
  });  
  //Registration successfull.
  message = [{"msg":"Registration successfull. Your Group Passkey is :" + new_passkey}]
  res.render('friends',{flash:{message:message}});
                //return new_passkey;
               })
               .catch(function(error){
                console.log("Runtime error:" + error);
               }); 
            }
            else if(friend.ac != student.ac){
              //Can't make group together
              message = [{"msg":"Group Formation Not possible because of different Room Choices."}]
              res.render('friends',{flash:{messages:message}});
            }
            else if(friend.share_choice != "YES"){
              //friend is not registered or individual
              message = [{"msg":"Your friend has chosen to apply individually. Contact admin for group Formation."}]
              res.render('friends',{flash:{messages:message}});
            }
            else{
              //friend is registered with another user
              message = [{"msg":'Sorry! Your friend is already locked with another user.'}];
              res.render('friends',{flash: {messages:message}});
            }
          })
        .catch(function(err){
          console.log("Runtime error 2:" + err);
        });

 

});

       
       
module.exports = router;
