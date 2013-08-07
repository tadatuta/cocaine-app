#!/opt/nodejs/0.10/bin/node

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , argv = require('optimist').argv;

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.set('handle', process.env.PORT || 3000);
  app.use(express.errorHandler());
} else {
  var cocaine = require('cocaine');
  var W = new cocaine.Worker(argv);
  var handle = W.getListenHandle('http');
  app.set('handle', handle);
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('handle'), function(){
  console.log('Express server listening on ' +
    (typeof app.get('handle') === 'number' ?
        'port ' + app.get('handle') : 'cocane handle') );
});
