var util = require("util");

//db/:collection/:operation/:document
var doError = function (e) {
	util.debug("ERROR: "+e);
	throw new Error(e);
	}

var mongodb = require('mongodb');
var db = new mongodb.Db('nodejitsu_s1anden_nodejitsudb7476805392',
  new mongodb.Server('ds045998.mongolab.com', 45998, {})
);
db.open(function(err, db_p) {
  if (err) {throw err;}
  db.authenticate('nodejitsu_s1anden', '7m767santo14imjmdsknu12ve6', function(err, replies) {

  });
});

// INSERT
exports.insert = function(database, collection, query, callback) {
  db.collection(collection).insert(query, {safe:true}, function(err, crsr) {
    console.log("Inserting doc with data: " + query);
    callback(crsr);
	});
}
				
// FIND
exports.find = function(database, collection, query, callback) {
  var crsr = db.collection(collection).find(query);
  console.log("Currently finding docs matching query '" + query + "'");
  crsr.toArray(function(err, docs) {
    if (err) doError(err);
    console.log("Returning docs = " + JSON.stringify(docs));
    callback(docs);
  });
}

// UPDATE
exports.update = function(database, collection, query, callback) {
  db.collection(collection).update(query.find, query.update, {new:true}, function(err, crsr) {
    if (err) doError(err);
    callback(query.update);
  });
}

exports.delete = function(database, collection, query, callback) {
  console.log("attempting to delete " + query);
  db.collection(collection).remove(query, true, function(err, crsr) {
    if (err) doError(err);
    callback('Delete succeeded');
  });
}
