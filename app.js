#!/opt/nodejs/0.10/bin/node

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('cocaine').http
  , path = require('path')
  , argv = require('optimist').argv;

var app = express();

argv.uuid && app.set('env', 'cocaine');

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
if ('cocaine' == app.get('env')) {
  var cocaine = require('cocaine'),
    W = new cocaine.Worker(argv),
    handle = W.getListenHandle('http');

  app.set('handle', handle);
} else {
  app.set('handle', process.env.PORT || 3000);
}

app.use(express.errorHandler());
app.get('/', routes.index);
app.get('/users', user.list);

var server = new http.Server(app);
server.listen(app.get('handle'), function(){
  console.log('Express server listening on ' +
    (typeof app.get('handle') === 'number' ?
        'port ' + app.get('handle') : 'cocane handle') );
});
