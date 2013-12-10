var express = require('express')
  , routes = require('./routes')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy
  , superagent = require('superagent')
  , OAuth = require('oauth')
  , mongo = require('./models/mymongo.js')
  , spotify = require('spotify');

require('superagent-oauth')(superagent);

var FACEBOOK_APP_ID = "685201864832535";
var FACEBOOK_APP_SECRET = "a1f185c26d2bff41a7a8d24839da563e";

var PROFILE_FIELDS = ['id', 'username', 'name', 'gender', 'displayName', 'photos', 'profileUrl'];
var profileToPassToClient;
var PORT = 3000;
var CALLBACK_URL = 'http://spotifyreviews.nodejitsu.com/auth/facebook/callback';
var LOGIN_PATH = '/';

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new FacebookStrategy({
	clientID: FACEBOOK_APP_ID,
	clientSecret: FACEBOOK_APP_SECRET,
	callbackURL: CALLBACK_URL,
	profileFields: PROFILE_FIELDS
},
function(accessToken, refreshToken, profile, done) {
	process.nextTick(function() {
		profileToPassToClient = profile;

		return done(null, profile);
	});
}));

var app = express();
var helpers = require('express-helpers');
helpers(app);
var server = require('http').createServer(app);
  
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Routes
app.get('/', function(req, res) {
	console.log("rendering index page");
	mongo.find("SpotifyReviews", "reviews", req.query, function(model){
		res.render('index', {title: "Spotify Reviews", reviews:model, user: req.user, profile: profileToPassToClient})
	});
});
app.get('/reviews/new', routes.newReview);
app.get('/reviews/:username/:song', routes.showReview);
app.post('/reviews/new', routes.createReview);

app.get('/account', ensureAuthenticated, routes.account);

app.get('/auth/facebook',
	passport.authenticate('facebook'),
	function(req, res){

	});

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {failureRedirect: LOGIN_PATH}),
	function(req, res){
		res.redirect('/');
	});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/search', routes.search);

app.get('/albums/:uri', routes.showAlbum);
app.post('/albums/:uri', routes.createReview);
//only for testing
// to use must change true to false in remove in mymongo.js
// app.get('/reviews/delete', routes.deleteAll);


app.listen(PORT);
console.log("Express server listening to " + PORT);

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {return next();}
	res.rediret('/login');
}