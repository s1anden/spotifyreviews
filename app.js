var express = require('express')
  , routes = require('./routes')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').FacebookStrategy
  , superagent = require('superagent')
  , OAuth = require('oauth');

require('superagent-oauth')(superagent);

var app = express();
  
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

// Routes
app.get('/', routes.index);
app.get('/reviews/new', routes.newReview);
app.get('/reviews/:username/:song', routes.showReview);
app.post('/reviews/new', routes.createReview);
app.post('/reviews/:username/:song', routes.editReview);
app.get('/reviews/:username/:song/delete', routes.deleteReview);
//only for testing
// to use must change true to false in remove in mymongo.js
// app.get('/reviews/delete', routes.deleteAll);


app.listen(3333);
console.log("Express server listening to 3333");
