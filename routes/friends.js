var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
Promise.promisifyAll(mongoose);
var db = require('../model/configDB');
var db2 = require('../model/friendsDB')


router.get('/friends',function(req,res){
   res.render('friends');
});

router.post('/friends',function(req,res){
    
       req.checkBody('passkey','Passkey error').notEmpty().isAlphanumeric();
       req.checkBody('comp_passkey','Passkey error').notEmpty().isAlphanumeric(); 
       req.checkBody('password','Password error').notEmpty().len(4,20);       
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
          var password_temp = req.body.password;
          if(student===null){
            message = [{"msg":"Please don't skip steps. Go register first."}]
            res.render('register',{flash:{messages:message}});
            return console.log("nope for student");
          }
          else if(student.share_choice === "YES" && student.comp_pass_key === "onwait"){  
           return  db.findOne({'pass_key': comp_passkey}).exec()
            .then(function(friend){
            if(friend === null){
              message = [{"msg":"Umm, your friend should register first, right? "}]
              res.render('register',{flash:{messages:message}});
              return console.log("nope for friend");
            } 
            if(friend.share_choice === "YES" && friend.comp_pass_key === "onwait" && friend.room_type === student.room_type){
               db.update({'pass_key':passkey},{'comp_pass_key':comp_passkey}).exec()
               .then(function(student){
                console.log("Student Updated");
                return db.update({'pass_key':comp_passkey},{'comp_pass_key':passkey}).exec()
               })
               .then(function(fri){
                console.log("Friend Updated");              
              var friends = new db2({
                            pass_key1:passkey,
                            pass_key2:comp_passkey,
                            pass_word:password_temp
                          });
            friends.save(function(err7){
                if(err7){
                  message = [{"msg":"Oops. Error on our side. Please try again. "}]
                  res.render('friends',{flash:{messages:message}});
                  return console.log("Couldn't Register");
                  }
                else {
  	                console.log("Student saved");
                    //New Passkey Generation
                    var new_passkey = Math.floor(Math.random() * (10000 - 1000)) + 1000;
                    return db2.update({'pass_key1':passkey},{'room_type':friend.room_type,'pass_key':new_passkey}).exec()
                    .then(function(lul){
                      console.log(lul);
                      var passkey_msg = "Done. Your Group Passkey is : " + new_passkey +". See ya during login!";
                      message = [{param: "success",msg : passkey_msg}];
                      res.render('home',{success:{messages:message}});
                    })
                    .catch(function(error){
                      console.log("Friends Save Runtime"+error);
                    });
                    }               
              })            
            console.log("Hogaya");
            });   
            }
            else if(friend.room_type != student.room_type){
              //Can't make group together
              message = [{"msg":"Your room choices differ. Can't have AC and Non AC together."}]
              res.render('friends',{flash:{messages:message}});
            }
            else if(friend.share_choice != "YES"){
              //friend is not registered or individual
              message = [{"msg":"Apparently your friend has applied individually."}]
              res.render('friends',{flash:{messages:message}});
            }
            else{
              //friend is registered with another user
              message = [{"msg":'Apparently your friend has made a group with someone else.'}];
              res.render('friends',{flash: {messages:message}});
            }
          })
         .catch(function(error){
                console.log("Runtime error:" + error);
              }); 
          }
          else if(student.share_choice != "YES"){
            //Share choice is no or not registered
            message = [{"msg":"Why making a group when you have applied individually?"}]
            res.render('home',{flash:{messages:message}});
          }
          else{
            //Already locked with another user
            message = [{"msg":'You have made a group before. Hence not allowed.'}];
            res.render('home',{flash: {messages:message}});
          }
        })
        .catch(function(err){
          console.log("Runtime error 2:" + err);
        });
});

       
module.exports = router;
