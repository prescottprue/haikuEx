var express = require('express'),
path = require('path'),
favicon = require('serve-favicon'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
_ = require('underscore'),
cors = require('cors');

var app = express(), 
routes = require('./backend/routes'),
routeBuilder = require('./backend/lib/routeBuilder')(app),
systemUtils = require('./backend/lib/systemUtils');

// view engine setup
app.set('views', path.join(__dirname, 'backend/views'));
app.set('view engine', 'jade');
// app.set('config', config);
// app.set('env', app.get('config').env);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
// app.use(express.static(path.join(__dirname, 'backend')));

//Set cors configuration
app.use(cors());

//------------ JSON Web Token Authentication Handling -----------//
// var jwt = require('express-jwt');
//Protect all routes except allowedPaths by requiring Authorization header
// var allowedPaths = ['/', '/login', '/signup', '/docs', '/admin/test'];
// app.use(jwt({secret: config.jwtSecret}).unless({path:allowedPaths}));

//Handle unauthorized errors
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).json({message:'Invalid token', code:'UNAUTHORIZED'});
//   }
// });

//Setup routes based on routes.js
routeBuilder(routes);

//------------ Error handlers -----------//

//Log Errors before they are handled
app.use(function (err, req, res, next) {
  console.log(err.message, req.originalUrl);
  if(err){
    res.status(500);
  }
  res.send('Error: ' + err.message);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'local') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
});

/**
 * Get port from environment and store in Express.
 */
var port = systemUtils.normalizePort(process.env.PORT || '3000');
console.log('localhost port:', port);
app.set('port', port);

var server = systemUtils.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

module.exports = app;
