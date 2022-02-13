require('dotenv').config();

const chalk        = require('chalk'),
      createError  = require('http-errors'),
      express      = require('express'),
      http         = require('http'),
      path         = require('path'),
      cookieParser = require('cookie-parser'),
      logger       = require('morgan'),

      checkDB      = require('./middlewares/checkDB.js'),

      indexRouter  = require('./routes/index'),
      usersRouter  = require('./routes/users'),

      port         = process.env.PORT,
      host         = process.env.APP_DOMAIN,

      app          = express(),
      server       = new http.Server(app);

server.listen(port, host, function(err, result) {
  if (err) {
    throw new Error();
  } else {
    checkDB();
    console.log( chalk.black.bgGreen(`server start listen ${host}:${port}` ));
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/pages')));

app.use('/users', usersRouter);
app.use('/', indexRouter);

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