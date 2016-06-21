var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var db = require('../model/configDB');
var multer = require('multer');



router.post('/register',function(req,res){

    req.checkBody('first_name','First Name error').notEmpty().isAlpha();
    req.checkBody('last_name','Last Name error').notEmpty().isAlpha();
    req.checkBody('pass_key','Pass Key error').notEmpty().isAlphanumeric();
    req.checkBody('roll_number','Roll Number error').notEmpty().isNumeric().isLength(9);
    req.checkBody('birth_date','Date of Birth error').notEmpty().isDate();
    req.checkBody('mobile','Mobile number error').notEmpty().isMobilePhone("en-IN");
    //req.checkBody('photo','Photo error').notEmpty();
    req.checkBody('branch','Branch error').notEmpty();
    req.checkBody('blood','Blood group error').notEmpty();
    req.checkBody('email','E-mail error').notEmpty().isEmail(); 
    req.checkBody('father_name','Father name error').notEmpty().isAlpha();    
    req.checkBody('father_number','Father mobile error').notEmpty().isMobilePhone("en-IN");       
    req.checkBody('mother_name','Mother name error').notEmpty().isAlpha();
    req.checkBody('mother_number','Mother mobile error').notEmpty().isMobilePhone("en-IN");
    req.checkBody('address','Address error').notEmpty(); 
    req.checkBody('landline','Landline error').isNumeric();    
    req.checkBody('share_choice','Share choice error').notEmpty().isAlpha(); 
    req.checkBody('password','Password error');      


var errors = req.validationErrors();
//var errors = '';

  if (errors) {
   //error messages graveyard † 
  console.log(errors);
  res.render('register', { flash: { messages: errors }});
  }

  else {
      console.log(req.file['path']);
      
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var pass_key = req.body.pass_key;
    var roll_number = req.body.roll_number;
    var birth_date = req.body.birth_date;

    var mobile = req.body.mobile;
    var photo =   req.file['path'];
    var branch = req.body.branch;
    var blood = req.body.blood;
    var email = req.body.email;
    var father_name = req.body.father_name;
    var father_num = req.body.father_number;
    var mother_name = req.body.mother_name;
    var mother_num = req.body.mother_number;
    var address = req.body.address;
    var landline = req.body.landline;
    var share_choice = req.body.share_choice;
    var password_temp = req.body.password;

    var bcrypt = require('bcrypt');
    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(password_temp, salt);    
    
   var student = new db({
                           name      :{
                                first: first_name,
                                last :last_name 
                            },
                           pass_key  :pass_key,
                           roll_number  :roll_number,
                           birth_date       :birth_date,
                           phone     :{
                                mobile:mobile,
                                landline:landline
                           },
                           branch:branch,
                           blood_group:blood,
                           email:email,
                           photo:photo,
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
                           landline: landline,
                           share_choice:share_choice,
                           pass_word:password
                       }); 
    
  student.save(function (err) {
  if (err) {
	    console.log(err);
  }
  else {
  	console.log("Student saved");
    res.send('Done!');
  }
});
  }
});

router.get('/register', function(req, res) {
  res.render('register');
  //next();
});
module.exports = router;
