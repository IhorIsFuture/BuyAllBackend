import express from 'express';
var router = express.Router();

import Mongo from 'mongodb';
var MongoClient = Mongo.MongoClient;
var urlProducts = "mongodb://localhost:27017/products";
var database;

MongoClient.connect(urlProducts, function(err, db) {
  if (err) throw err;
  var dbo = db.db("products");
  database = dbo;
});

router.route('/phones').get((req, res) => {
		database.collection("phones").find({}).toArray((err, products) => {
			   if (err) throw err;	   
			   res.json(products);
			  
 	});
});

router.route('/phones/:id').get((req, res) => {
	  var id = new Mongo.ObjectID(req.params.id);
	  var query = { '_id': id};
	  database.collection("phones").find(query).toArray((err, product) => {
	   if (err) throw err;	   
	   res.send(product[0]);
	   
  });

});

router.route('/phones/add').post((req, res) => {
	
	database.collection("phones").insertOne(req.body, (err, result) => {
    if (err) throw err;    
    res.send('Document added successfully!');
  });
});

router.route('/update/phones/:id').post((req, res) => {

	var id = new Mongo.ObjectID(req.params.id);
	var query = { '_id': id};
	var newvalues = { $set: {title : req.body.title,
							shortDescription: req.body.shortDescription,
							description: req.body.description,
							image: req.body.image,
							cost: req.body.cost} };
	database.collection("phones").updateOne(query, newvalues, (err, resuslt) => {
	    if (err) throw err;
	    res.json('Update Done!');	    	    
	 });
});




router.route('/delete/phones/:id').get((req, res) => {

	var id = new Mongo.ObjectID(req.params.id);
	var query = { '_id': id};
	database.collection("phones").deleteOne(query, function(err, resuslt) {
	    if (err) throw err;
	    res.json('Remove successfully');	    	    
	 });	
});

module.exports = router