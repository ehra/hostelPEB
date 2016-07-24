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
           return  db.findOne({'pass_key': comp_passkey}).exec()
            .then(function(friend){
          if(friend === undefined) return console.log("nope");
            if(friend.share_choice === "YES" && friend.comp_pass_key === "onwait" && friend.room_type === student.room_type){
               db.update({'pass_key':passkey},{'comp_pass_key':comp_passkey}).exec()
               .then(function(student){
                console.log("Student Updated");
                return db.update({'pass_key':comp_passkey},{'comp_pass_key':passkey}).exec()
               })
               .then(function(fri){
                console.log("Friend Updated");
                })
                //New Passkey Generation
                var password_temp = req.body.password;

         /* bcrypt.genSalt(10,function(err1,saltRounds){
            if(err1) return console.log("Sorry");
            bcrypt.hash(password_temp, saltRounds,function(err2,hash){
              if(err2) return console.log("Unable to process request");

              var friends = new db2({
                            pass_key1:passkey,
                            pass_key2:comp_passkey,
                            pass_word:hash
                          });
              friends.save(function(err7){
                //Registration Unsuccessful.
                if(err7){
                  return console.log("Couldn't Register");
                  }
                else {
  	                console.log("Student saved");
                    var new_passkey = Math.floor(Math.random() * (10000 - 1000)) + 1000;
                    return db2.update({'pass_key1':passkey},{'room_type':friend.room_type,'pass_key':new_passkey}).exec()
                          .then(function(lul){
                           console.log(lul);
                           var passkey_msg = "Done. Your Group Passkey is : " + new_passkey;
                           message = [{
                                        param: "success",
                                        msg : passkey_msg
                                      }];
                           res.render('home',{success:{messages:message}});
                            })
                           .catch(function(error){
                            console.log("Shite fuck"+error);
                            });
                }               
              })         
           
            })
        });  */    
  
  
  //Registration successfull.
  //message = [{"msg":"Registration successfull. Your Group Passkey is :"}]
  //res.render('friends',{flash:{message:message}});
                //return new_passkey;
                console.log("Hogaya");
               
              
            }
            else if(friend.room_type != student.room_type){
              //Can't make group together
              message = [{"msg":"Group Formation Not possible because of different Room Types."}]
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
         .catch(function(error){
                console.log("Runtime error:" + error);
              }); 
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
        .catch(function(err){
          console.log("Runtime error 2:" + err);
        });
});

       
module.exports = router;
