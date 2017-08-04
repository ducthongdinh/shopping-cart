var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var index = require('./routes/index');
var user = require('./routes/user');

var app = express();

var connectionString = 'mongodb://thong:MHPpUIOwKv6yti4t@thong-shard-00-00-9nvdr.mongodb.net:27017,thong-shard-00-01-9nvdr.mongodb.net:27017,thong-shard-00-02-9nvdr.mongodb.net:27017/shopping?ssl=true&replicaSet=thong-shard-0&authSource=admin';
//connectionString =  'localhost:27017/shopping'; 
mongoose.connect(connectionString);
require('./config/passport');
//check connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
})

//routes
app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
