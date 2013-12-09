var spotify = require('spotify');

exports.search = function(terms, callback) {
	console.log(terms);
	spotify.search({ type: 'album', query: terms }, function(err, data) {
		if (err) {
			console.log("Error occurred: " + err);
			return;
		}
		callback(data)
	});
}

exports.lookup = function(uri, callback) {
	console.log(uri.substring(14));
	spotify.lookup({ type: 'album', id: uri.substring(14) }, function(err, data) {
		console.log(data);
		if (err) {
			console.log("Error occurred: " + err);
			return;
		}
		callback(data);
	});
}