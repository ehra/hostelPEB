var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var multer = require('multer');
var io    = require( "socket.io" )();  
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./model/configDB');
var db2 = require('./model/friendsDB');
var bcrypt = require('bcryptjs');
var session = require('cookie-session')
var cookieParser1 = require('socket.io-cookie');

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.findById(id, function(err, user) {
    done(err, user.id);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  var pass_key = username;
    db.findOne({'pass_key':pass_key},function(err,student){
        if(err) return done(err);//wrong roll_number or password;
        if(student.comp_pass_key != "onwait"){
            db2.findOne({'pass_key1':pass_key},function(err2,friend){
                if(err2) return done(err2);
                var pass_retrieved = friend.pass_word;
             bcrypt.compare(password, pass_retrieved, function(err3, correct) {
              //Adding alert messages
              if(err3) return done(null, false ,{ message: 'Incorrect password.' }); //wrong password
              //if (err3) {
              //console.log(err3);
              //res.render('home', { flash: { messages: 'Incorrect password!' }});
              //}
              if(correct){
                  return done(null, student);
              }     
             });
           });
        }else{
         var pass_retrieved = student.pass_word;
         bcrypt.compare(password, pass_retrieved, function(err3, correct) {
          if(err3) return done(null,false);  // wrong password      
          if(correct){
              return done(null,student);
          } 
         });
        }
    });
}));

// Socket.io
app.io  = io;


var users = require('./routes/users');
var register = require('./routes/register');
var friends = require('./routes/friends');
var success = require('./routes/friends');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest:'./photos/',limits:{files:1,fileSize:500000}}).single('photo'));
app.use(validator());
app.use(cookieParser());
io.use(cookieParser1);
app.use(session({
    secret: 'asdfdxoubjhf2354dyhgdj4635696',
    resave: true,
    saveUninitialized: false,
    autoSave:true
}));

app.use(passport.initialize());
app.use(passport.session());


//Tells Express what files to use for routing
app.get('/', function(req,res){
  if(req.user){
    res.redirect('/users');
  }else{
    res.render('home');
  }
});

app.post('/',passport.authenticate('local',{failureRedirect: '/'}),
function(req,res,next){
  res.cookie('cpn',req.user.id);
  res.redirect('/users');
});

app.get('/users',users(app.io));
//For posting
app.post('/success',success);

app.get('/register',register);
app.post('/register',register);

app.get('/friends',friends);
app.post('/friends',friends);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
