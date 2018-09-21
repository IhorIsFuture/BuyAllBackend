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

router.route('/computers/').get((req, res) => {
		database.collection("computers").find({}).toArray((err, products) => {
			   if (err) throw err;	   
			   res.json(products);
			  
 	});
});

router.route('/computers/:id').get((req, res) => {
	  var id = new Mongo.ObjectID(req.params.id);
	  var query = { '_id': id};
	  database.collection("computers").find(query).toArray((err, product) => {
	   if (err) throw err;	   
	   res.send(product[0]);
	   
  });

});

router.route('/computers/add').post((req, res) => {
	
	database.collection("computers").insertOne(req.body, (err, result) => {
    if (err) throw err;
    res.send('Document added successfully!');
    
  });
});

router.route('/computers/update/:id').post((req, res) => {

	var id = new Mongo.ObjectID(req.params.id);
	var query = { '_id': id};
	var newvalues = { $set: {title : req.body.title,
							shortDescription: req.body.shortDescription,
							description: req.body.description,
							image: req.body.image,
							cost: req.body.cost} };
	database.collection("computers").updateOne(query, newvalues, (err, resuslt) => {
	    if (err) throw err;
	    res.json('Update Done!');	    	    
	 });
});




router.route('/computers/delete/:id').get((req, res) => {

	var id = new Mongo.ObjectID(req.params.id);
	var query = { '_id': id};
	database.collection("computers").deleteOne(query, function(err, resuslt) {
	    if (err) throw err;
	    res.json('Remove successfully');	    	    
	 });	
});

module.exports = router