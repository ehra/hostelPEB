var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var multer = require('multer');
var socket_io    = require( "socket.io" );  

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var friends = require('./routes/friends');

var app = express();

// Socket.io
var io           = socket_io();
app.io           = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest:'./photos/',limits:{files:1,fileSize:500000}}).single('photo'));

// socket.io events




//Tells Express what files to use for routing
app.get('/', routes(app.io));
app.post('/',routes(app.io));

app.get('/users', users(app.io));

app.get('/register',register(app.io));
app.post('/register',register(app.io));

app.get('/friends',friends(app.io));
app.post('/friends',friends(app.io));

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
