var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var db = require('../model/configDB');
var multer = require('multer');
var bcrypt = require('bcryptjs');
mongoose.Promise = require('bluebird');
var upload = multer({dest:'./photos/',
             limits:{files:1,fileSize:500000},//~500kb
             fileFilter: function (req,file,cb) {
             if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
              return cb(null, false); //image upload kar be!***error***
             }else{
               return cb(null, true);
             }
            }
           }).single('photo');


router.post('/register',upload,function(req,res){

 //   req.checkBody('first_name','First Name error').notEmpty().isAlpha();
 //   req.checkBody('last_name','Last Name error').notEmpty().isAlpha();
 //   req.checkBody('pass_key','Pass Key error').notEmpty().isAlphanumeric();
    req.checkBody('roll_number','Roll Number error').notEmpty().isNumeric().isLength(9);
    req.checkBody('birth_date','Date of Birth error').notEmpty().isDate();
    req.checkBody('mobile','Mobile number error').notEmpty().isMobilePhone("en-IN");
   // req.file('photo','Photo error').notEmpty();
 //   req.checkBody('branch','Branch error').notEmpty();
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
    req.checkBody('conf_password','Password not same').equals(req.body.password);

var errors = req.validationErrors();
//var errors = '';

  if (errors) {
  //error messages graveyard † 
  console.log(errors);
  res.render('register', { flash: { messages: errors }});
  }

  else {
  //  req.sanitizeBody('first_name').escape().trim();
  //  req.sanitizeBody('last_name').escape().trim();
  //  req.sanitizeBody('pass_key').escape();
    req.sanitizeBody('roll_number' ).escape();
    req.sanitizeBody('birth_date').escape();
    req.sanitizeBody('mobile' ).escape();
   // req.file('photo' ).escape();
  //  req.sanitizeBody('branch').escape();
    req.sanitizeBody('blood' ).escape();
    req.sanitizeBody('email').escape(); 
    req.sanitizeBody('father_name').escape();    
    req.sanitizeBody('father_number').escape();       
    req.sanitizeBody('mother_name').escape();
    req.sanitizeBody('mother_number').escape();
    req.sanitizeBody('address').escape(); 
    req.sanitizeBody('landline').escape();    
    req.sanitizeBody('share_choice').escape(); 
    req.sanitizeBody('password').escape();      
    req.sanitizeBody('conf_password').escape();

    //getting info from db
    
      
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
    var password = null;
    if(password_temp!=null){
    var salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password_temp , salt);    
    }
    
        //check if user already exists
   db.find({'pass_key':pass_key}).count().exec()
    .then(function(count){
      if(count>0) return console.log("You are alredy registered");
    })
    .catch(function(err){
      return console.log(err);
    });
   
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
                           pass_word:password,
                           comp_pass_key:"onwait"
                       }); 

  student.save(function (err) {
  if (err) {
	    console.log(err);
  }
  else {
  	console.log("Student saved");
    message = [
                {
                  "param": "success",
                  "msg": "You have been successfully registered!",
                  "value": ""
                }
              ];
    res.render('home', {flash:{ messages: message} });
  }
});
  }
});

module.exports = router;