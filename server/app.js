var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mongoose = require('mongoose');
var session = require('express-session');
//var MongoDBSession = require('connect-mongodb-session')(session)

const url = `mongodb://127.0.0.1:27017/collab-doc`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// const store = new MongoDBSession({
//   uri: url,
//   collection: "sessions",
// });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require("./routes/api");
var collectionRouter = require("./routes/collection")
var mediaRouter = require("./routes/media")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


function setHeader(req, res, next) {
  res.set('X-CSE356', '6359c54b1184b864d4b35f34')
  next()
}
app.use(setHeader)

app.use(session({
  secret: 'dragons',
  resave: false,
  saveUninitialized: false,
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/collection', collectionRouter)
app.use('/media', mediaRouter)
app.use('/library', express.static('library'))

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
