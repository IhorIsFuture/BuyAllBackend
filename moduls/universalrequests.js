import express from 'express';
var router = express.Router();

import Mongo from 'mongodb';


import NodeCache from "node-cache";
const myCache = new NodeCache();

var MongoClient = Mongo.MongoClient;
var urlProducts = "mongodb://localhost:27017/";
var database;
var sendCollections = [];
var sendDatabases = [];

router.route('/getCach').get((req, res) => {
	
	let keys = [];
	let productsFromCach = [];
	myCache.keys( function( err, mykeys ){
		if( !err ){
			keys = mykeys;
			
				   
		}
	});

	for(let i=0;i<keys.length;i++) {

		myCache.get( keys[i], function( err, value ){
		  if( !err ){
		    if(value == undefined){
		      // key not found
		    }else{
		      
		    	productsFromCach[i] = value;
		    };
		  }
		});
	};

	res.json(productsFromCach);

	

});


router.route('/:database/:collection').get((req, res) => {
		var collection = req.params.collection;
		var database = req.params.database;		

		MongoClient.connect(urlProducts, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(database);
		  database = dbo;


		 	database.collection(collection).find({}).toArray((err, products) => {
			   if (err) throw err;        

			   let firstProdCache = {};
			   let secondProdCache = {};

			   let productsForChange = products;
			   for(let i=0;i<productsForChange.length;i++) {

			   		productsForChange[i].cost = +productsForChange[i].cost;	

					if( i === 0 ) {
						firstProdCache = productsForChange[i];

					};

					if( i === 1 && firstProdCache.cost > productsForChange[i].cost ) {

						secondProdCache = productsForChange[i];

					} else {

						if(i === 1){
							secondProdCache = firstProdCache;
							firstProdCache = productsForChange[i];
						};
						
					  };

					if(i > 1) {

						if(firstProdCache.cost < productsForChange[i].cost) {
							secondProdCache = firstProdCache;
							firstProdCache = productsForChange[i];
						} else {
							if( secondProdCache.cost < productsForChange[i].cost) {
								secondProdCache = productsForChange[i];
							};
						};


					};				   	

			   };



			   myCache.set( firstProdCache.title, firstProdCache, function( err, success ){
				  if( !err && success ){
				   // console.log( success );
				    // true
				    // ... do something ...
				  }
				});

			    myCache.set( secondProdCache.title, secondProdCache, function( err, success ){
				  if( !err && success ){
				    //console.log( success );
				    // true
				    // ... do something ...
				  }
				});

			   

			  
			   



			   res.json(products);
			  
 			});
		  	db.close();
		});
		
});

router.route('/:database/:collection/:id').get((req, res) => {
	
	var collection = req.params.collection;
	var database = req.params.database;
	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(database);
	  database = dbo;

	  var id = new Mongo.ObjectID(req.params.id);
	  var query = { '_id': id};
	  database.collection(collection).find(query).toArray((err, product) => {
	  	if (err) throw err;	   
	  	res.send(product[0]);  

	  });	  
	   db.close();
 	});

});

router.route('/byTitle/:database/:collection/:title').get((req, res) => {
	
	var collection = req.params.collection;
	var database = req.params.database;
	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(database);
	  database = dbo;

	  var title = req.params.title;

	  // = new Mongo.ObjectID(req.params.id);
	  var query = { 'title': title};
	  
	  database.collection(collection).find(query).toArray((err, product) => {
	  	if (err) throw err;	   
	  	
	  	res.send(product[0]); 


	  });	  
	   db.close();
 	});

});

router.route('/:database/:collection/add').post((req, res) => {
	
	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(req.params.database);
	  database = dbo;

	  database.collection(req.params.collection).insertOne(req.body, (err, result) => {
	    if (err) throw err;
	    res.json('Document added successfully!');
    
  	  });	  
	   db.close();
 	});

	
});

router.route('/updateWithoutField/:database/:collection/:id').post((req, res) => {

	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(req.params.database);
	  database = dbo;

		var id = new Mongo.ObjectID(req.params.id);
		var query = { '_id': id};
		let sendProduct = req.body;
		
		 
		
		let valuesObject = {};						
		for( let key in req.body) {
			if(key != '_id' && key != '__v'){
				valuesObject[key] = req.body[key];
			};
		};
		

		database.collection(req.params.collection).deleteOne(query, function(err, resuslt) {
		    if (err) throw err;
		        	    
	 	});

			db.close();
 	});

 	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(req.params.database);
	  database = dbo;

		var id = new Mongo.ObjectID(req.params.id);
		var query = { '_id': id};
		let sendProduct = req.body;
		
		 
		
		let valuesObject = {};						
		for( let key in req.body) {
			if(key != '_id' && key != '__v'){
				valuesObject[key] = req.body[key];
			};
		};

		database.collection(req.params.collection).insertOne(valuesObject, (err, result) => {
	    if (err) throw err;
	   	
    		
  	  	});	
		
			
		
		db.close();
 	});


	
});


router.route('/update/:database/:collection/:id').post((req, res) => {

	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(req.params.database);
	  database = dbo;

		var id = new Mongo.ObjectID(req.params.id);
		var query = { '_id': id};
		let sendProduct = req.body;
		
		var newvalues;

		
		let valuesObject = {};						
		for( let key in req.body) {
			if(key != '_id' && key != '__v'){
				valuesObject[key] = req.body[key];
			};
		};
		newvalues = { $set: valuesObject};
			
		database.collection(req.params.collection).updateOne(query, newvalues, (err, resuslt) => {
		    if (err) throw err;
		    res.json('Update Done!');	    	    
		});


		db.close();
 	});
	
});

router.route('/delete/:database/:collection/:id').get((req, res) => {


	MongoClient.connect(urlProducts, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(req.params.database);
	  database = dbo;

	  	var id = new Mongo.ObjectID(req.params.id);
		var query = { '_id': id};
		database.collection(req.params.collection).deleteOne(query, function(err, resuslt) {
		    if (err) throw err;
		    res.json('Remove successfully');	    	    
	 	});
	 			
		db.close();
 	});
	
});




module.exports = router