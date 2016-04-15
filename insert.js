var definitions = require('./data/definitions'),
	MongoClient = require('mongodb').MongoClient;

var dbhost = 'mongodb://localhost:27017/test',
	myCollection = 'definitions';

function seedData(db, callback) {
	db.collection(myCollection).find({}, {}, {}).toArray(function(err, docs) {
		if (docs.length <= 0) {			
			console.log('No data. Seeding ...');

			function ihandler(err, recs) {
				if (err) { throw err; }
				inserted += 1;
			}

			var toInsert = definitions.length,
				inserted = 0,
				sync;

			definitions.forEach(definition => {
				db.collection(myCollection).insert({
					term: definition.term,
					defined: definition.defined
				}, ihandler);
			});

			sync = setInterval(function() {
				if (inserted === toInsert) {
					clearInterval(sync);
					callback(db);
				}
			}, 50);
			return;
		} else {
			callback(db);
			return;
		}
	});
}

function showDocs(db) {
	console.log(`Listing records in ${myCollection}: `);

	var options = {};

	db.collection(myCollection).find({}, {}, options).toArray(function(err, docs) {
		if (err) { throw err; }
		docs.forEach(doc => {
			console.log(`${doc.term}: ${doc.defined}`);
		});
		db.close();
	});
}

MongoClient.connect(dbhost, function(err, db) {
	if (err) { console.log(err); }
	seedData(db, showDocs);
})
