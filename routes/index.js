var mongo = require("../models/mymongo.js");
var spotify = require("../models/myspotify.js");

exports.index = function(req, res) {
	console.log("rendering index page");
	mongo.find("SpotifyReviews", "reviews", req.query, function(model){
		res.render('index', {title: "Spotify Reviews", reviews:model})
	})
};

exports.newReview = function(req, res) {
	res.render('new', {title: "New Review", user:req.user});
};

exports.createReview = function(req, res) {
	mongo.insert("SpotifyReviews", "reviews", {user:req.user, reviewText:req.param('reviewText'), album:req.album}, function(model){
		res.redirect('/');
	});
};

exports.showReview = function(req, res) {
	mongo.find("SpotifyReviews","reviews", {username:req.params.username, song:req.params.song}, function(model){
		res.render('show', {title: "Spotify Reviews", review:model[0]})
	})
};

exports.editReview = function(req, res) {
	mongo.update("SpotifyReviews", "reviews", {find:{username:req.params.username, song:req.params.song}, update:{$set:{username:req.param('username'), reviewText:req.param('reviewText'), song:req.param('song')}}}, function(model){
		console.log("Updating review by " + req.params.username + " for song " + req.params.song + " to review " + req.param('reviewText') + " by user " + req.param('username') + " for song " + req.param('song'));
		res.render('show', {title: "Spotify Reviews", review:model.$set})
	})
};

exports.deleteReview = function(req, res) {
	mongo.delete("SpotifyReviews", "reviews", {username:req.params.username, song:req.params.song}, function(model){
		res.redirect('/');
	})
};

exports.search = function(req, res) {
	spotify.search(req.query.terms, function(data) {
		console.log(data);
		res.render('search', {title: "Spotify Reviews", results:data.albums});
	});
};

exports.showAlbum = function(req, res) {
	spotify.lookup(req.params.uri, function(data) {
		console.log(data);
		res.render('album', {title: "Spotify Reviews", album:data.album, user: req.user});
	});
};
// testing purposes only
// exports.deleteAll = function(req, res) {
// 	mongo.delete("SpotifyReviews", "reviews", req.query, function(model){
// 		res.redirect('/');
// 	})
// }