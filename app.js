var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var io    = require( "socket.io" )();  
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./model/configDB');
var db2 = require('./model/friendsDB');
var session = require('cookie-session')
var cookieParser1 = require('socket.io-cookie');

var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
Promise.promisifyAll(mongoose);
var app = express();

//var message=[];


// Socket.io
app.io  = io;


var users = require('./routes/users');
var register = require('./routes/register');
var registerP = require('./routes/registerP');
var friends = require('./routes/friends');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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

app.io.on('connection', function(socket){
  
    socket.on('forgot',function(passkey){
      db2.findOne({'pass_key1':passkey}).exec()
        .then(function(person){
          if(person === null){
            return db2.findOne({'pass_key2':passkey}).exec()
            .then(function(person2){
              if(person2 === null){
                return socket.emit('reply',"You are not in any Group, wait for group registration to resume");
              }else{
                return socket.emit('reply',person2.pass_key);            
              }
        })

          }else{
            return socket.emit('reply',person.pass_key);            
          }
        })
    });

   socket.on('disconnect',function(){
      console.log("Bye!");
      socket.disconnect(true); 
    });
 });

//Tells Express what files to use for routing
app.get('/', function(req,res){
  if(req.cookies.cpn){
   var id = req.cookies.cpn;
   if(id === "dafa3442"){
    res.render('home');
   }
    res.redirect('/users');
  }else{
    res.render('home');
    //res.render('home',{ flash: { messages: message}});
  }
});


app.post('/',function(req,res,next){
  var pass_key = req.body.username;
  var password = req.body.password
  
   db.findOne({'pass_key':pass_key}).exec()
  .then(function(student){
    if(student != null){
      
      if(student.pass_word != password){
       message = [{"msg":"Wrong Password"}]
       res.render('home',{flash:{messages:message}});  
       return 0;    
      }
      var id = student._id;
      res.cookie('cpn',id);
      res.redirect('/users');
    }else{
      return  db2.findOne({'pass_key':pass_key}).exec()
    }
  })
  .catch(function(err){
     message = [{"msg":"Wrong ID/Password"}];
     res.render('home',{flash:{messages:message}});    
      return console.log(err);
  })
  .then(function(student){
    if(student != null){
      if(student.pass_word != password){
       message = [{"msg":"Wrong Password"}];
       res.render('home',{flash:{messages:message}});      
       return 0;      
      }
      var id = student._id;      
      res.cookie('cpn',id);
      res.redirect('/users');
    }else{
     message = [{"msg":"Wrong ID/Password"}];
     res.render('home',{flash:{messages:message}});    
     return console.log(err);      
    }
  })
  .catch(function(err){

     message = [{"msg":"Wrong ID/Password"}];
     res.render('home',{flash:{messages:message}});    
     return console.log(err);
  })   
});


app.get('/users',users(app.io));

app.get('/lastpage', function(req,res){
  var cpn = "dafa3442";
  res.cookie('cpn',cpn);
  res.render('success', {
    flash: { message: "Congratulations! Your room "+req.query.room +", has been booked!"} } );
});
app.get('/rules', function(req,res){
  res.render('instruct');
});
app.get('/register',register(app.io));
app.post('/registerP',registerP);

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
