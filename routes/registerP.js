var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var db = require('../model/configDB');
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
Promise.promisifyAll(mongoose);
var verify = require('../model/verify');
var messages = [];


router.post('/registerP',function(req,res){

 
    req.checkBody('roll_num','Roll Number error').notEmpty().isNumeric(9);
    req.checkBody('birth_date','Date of Birth error').notEmpty().isDate();
    req.checkBody('mobile','Mobile number error').notEmpty().isMobilePhone("en-IN");
    req.checkBody('blood','Blood group error').notEmpty();
    req.checkBody('email','E-mail error').notEmpty().isEmail(); 
    req.checkBody('father_name','Father name error').notEmpty();    
    req.checkBody('father_number','Father mobile error').notEmpty().isMobilePhone("en-IN");       
    req.checkBody('mother_name','Mother name error').notEmpty();
    req.checkBody('mother_number','Mother mobile error').notEmpty().isMobilePhone("en-IN");
    req.checkBody('address','Address error').notEmpty(); 
    req.checkBody('share_choice','Share choice error').notEmpty().isAlpha(); 
    
    if(req.body.password === '' && req.body.share_choice === "YES"){
      var errors = req.validationErrors();
      console.log(errors);
    }
    else if(req.body.password != '' && req.body.share_choice === "YES"){
      var errors = [{"msg":"Password not required for Group Formation. Refresh and Register again."}];
    }
    else{
      req.checkBody('password','Password Required').notEmpty().len(4,20);
      req.checkBody('conf_password','Passwords not same').notEmpty().equals(req.body.password);
      var errors = req.validationErrors();
    }

  if (errors) {
  //error messages graveyard † 
  console.log(errors);
  res.render('register', { flash: { messages: errors }});
  }

  else {
    req.sanitizeBody('roll_num').escape();
    req.sanitizeBody('birth_date').escape();
    req.sanitizeBody('mobile' ).escape();
    req.sanitizeBody('blood' ).escape();
    req.sanitizeBody('email').escape(); 
    req.sanitizeBody('father_name').escape();    
    req.sanitizeBody('father_number').escape();       
    req.sanitizeBody('mother_name').escape();
    req.sanitizeBody('mother_number').escape();
    req.sanitizeBody('address').escape(); 
    req.sanitizeBody('share_choice').escape(); 
    req.sanitizeBody('password').escape();      
    req.sanitizeBody('conf_password').escape();

    var roll_number = req.body.roll_num;
    
  verify.findOne({"roll_num":roll_number}).exec()
  .then(function(results){
    console.log(req.body.password);
    if(results != null){
    var name = results.name;
    var passkey = results.Passkey;

    var birth_date = req.body.birth_date;
    var mobile = req.body.mobile;
    var branch = results.Branch;
    var blood = req.body.blood;
    var email = req.body.email;
    var father_name = req.body.father_name;
    var father_num = req.body.father_number;
    var mother_name = req.body.mother_name;
    var mother_num = req.body.mother_number;
    var address = req.body.address;
    var share_choice = req.body.share_choice;
    var room_type = results.room_type;
    var password_temp = req.body.password;
    var password = null;
    if(password_temp!=null){
      password = password_temp;
    }
    else{
      password = "random";
    }
          
        //check if user already exists
   db.find({'roll_number':roll_number}).count().exec()
    .then(function(count){
      if(count!=0){
        var message = [{msg:"You have registered previously. No need to try again, R.I.P †"}];
        res.render('home',{flash:{messages:message}});
        return console.log("You are already registered");
      } 
    })
    .catch(function(err){
      var message = [{msg:"Try Again †"}];
      res.render('home',{flash:{messages:message}});
      return console.log(err);
    });
   
   var student = new db({
                           name      :name,
                           pass_key  :passkey,
                           roll_number :roll_number,
                           birth_date   :birth_date,
                           phone :{
                                mobile:mobile
                           },
                           branch:branch,
                           blood_group:blood,
                           email:email,
                           parent_detail:{
                            father:{
                               name: father_name,
                               phone:father_num
                            },
                            mother:{
                               name:mother_name,
                               phone:mother_num
                            }
                           },
                           address:address,
                           share_choice:share_choice,
                           pass_word:password,
                           comp_pass_key:"onwait",
                           room_type:room_type
                       }); 

  student.save(function (err) {
  if (err) {
        var message = [{msg:"Sorry please try again, R.I.P †"}];
        res.render('home',{flash:{messages:message}});
        return  console.log(err);
  }
  else {
  	console.log("Student saved");
    message = [
                {
                  "param": "success",
                  "msg": "Registration Complete! Hurray!",
                  "value": ""
                }
              ];
      res.render('home', {success:{ messages: message} });  
  }
});
  
}
      else{
       var message = [{msg:"Wrong Roll Number, R.I.P † ."}];
       res.render('home',{flash:{messages:message}});
       return console.log("User not found");
      }
    })
    .catch(function(err){
       var message = [{msg:"Error"}];
       res.render('home',{flash:{messages:message}});
      console.log(err);
    });



}
});

module.exports = router;
