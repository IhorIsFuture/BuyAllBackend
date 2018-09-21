import express from 'express';
var router = express.Router();

import Mongo from 'mongodb';
var MongoClient = Mongo.MongoClient;
var urlProducts = "mongodb://localhost:27017/";
var database;

router.route('/signup').post((req, res) => {
	
	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db('users');
	  database = dbo;

	  database.collection('users').insertOne(req.body, (err, result) => {
	    if (err) throw err;
	    
	    res.json('Document added successfully!');
    
  	  });	  
	   db.close();
 	});

	
});

router.route('/getUniqueNicksEmails/').get((req, res) => {
	
	
	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db('users');
	  database = dbo;

	  
	  database.collection('users').find({}).toArray((err, product) => {
	  	if (err) throw err;	
	  	

	  	res.send(product);  

	  });	  
	   db.close();
 	});

});

router.route('/signIn/').post((req, res) => {
	
	
	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db('users');
	  database = dbo;

	  
	  database.collection('users').find({email: req.body.email}).toArray((err, product) => {
	  	if (err) throw err;	
	  	

	  	res.send(product[0]);  

	  });	  
	   db.close();
 	});

});



module.exports = router