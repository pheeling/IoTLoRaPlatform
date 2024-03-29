var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var iotaRouter = require('./routes/iota');
var iotaSetupRouter = require('./routes/shimmerIotaSetup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/iota', iotaRouter);
app.use('/iota/sub', iotaRouter);
app.use('/iota/writeToIota', iotaRouter);
app.use('/iota/savePassword', iotaRouter);
app.use('/iota/createDB', iotaRouter);
app.use('/iota/createAccount', iotaRouter);
app.use('/iota/listAddresses', iotaRouter);
app.use('/iota/checkBalance', iotaRouter);
app.use('/shimmerIotaSetup', iotaSetupRouter);
app.use('/shimmerIotaSetup/DBandAccount', iotaSetupRouter);
app.use('/shimmerIotaSetup/setMasterPassword', iotaSetupRouter);
app.use('/iota/shimmerCheckBalance', iotaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
