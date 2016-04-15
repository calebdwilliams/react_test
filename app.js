/* jshint esversion: 6 */
'use strict';

var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	MongoClient = require('mongodb').MongoClient,
	ObjectId 	= require('mongodb').ObjectId,
	app 		= express(),
	port 		= 3011,
	mongoPort 	= 27017,
	dbhost 		= `mongodb://localhost:${mongoPort}/test`,
	collection 	= 'definitions' ;

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


// API
app.get('/definitions', (req, res) => {
	MongoClient.connect(dbhost, function(err, db) {
		if (err) { console.log(err); }
		db.collection(collection).find({}, {}, {}).toArray(function(err, docs) {
			if (err) { console.log(err); }
			res.json(docs);
		});
	});
});
app.post('/definitions', (req, res) => {
	var body = req.body;
	MongoClient.connect(dbhost, function(err, db) {
		if (err) { console.log(err); }
		if (req.query.id) {
			var id = new ObjectId(req.query.id);
			db.collection(collection).update({ _id: id }, {
				term: body.term,
				defined: body.defined
			});
		}
	});
	res.json({itWorked: true});
});
app.get('/gopal', function(request, response) { 
	response.writeHead({
		'Content-Type': 'text/html'
	})
	response.send(['Gopal', 'Cheruku']); 
});
// Custom middleware
app.use((req, res, next) => {
	console.log(`${req.method}:\t ${req.url}`);
	next();
});
app.listen(port);



console.log(`Express app is running on port: ${port}`);
console.log(`Connected to MongoDB on port: \t${mongoPort}`);
module.exports = app;
