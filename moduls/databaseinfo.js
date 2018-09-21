import express from 'express';
var router = express.Router();

import Mongo from 'mongodb';
var MongoClient = Mongo.MongoClient;


var urlProducts = "mongodb://localhost:27017/";
var database;
var sendCollections = [];
var sendDatabases = [];


router.route('/listdatabases/').get((req, res) => {
	sendCollections = [];
	sendDatabases = [];
	MongoClient.connect(urlProducts, function(err, db) {

	  if (err) throw err;
	  var dbo = db.db('');
	  database = dbo;


		const adminDb = database.admin();
	  	adminDb.listDatabases(function(err, dbs) {

	  	var i =0;
	  	var subI = 0;
	  	
	  	for(var j=0; j<(dbs.databases.length-2); j++) {

	  		
	  		i = subI;
	  		while (i < dbs.databases.length) {
 	
	  			
	  			if(dbs.databases[i].name !== 'admin' && dbs.databases[i].name !== 'local'){
	  				sendDatabases[j] = dbs.databases[i].name;
	  				i +=1;
	  				subI = i;
	  				break;
	  			}else{
	  				i += 1;
	  				if(dbs.databases[i].name !== 'admin' && dbs.databases[i].name !== 'local'){
	  					sendDatabases[j] = dbs.databases[i].name;
	  					i +=1;
	  					subI = i;
	  					break;
	  				}else {
	  					i += 1;
	  					sendDatabases[j] = dbs.databases[i].name;
	  					i +=1;
	  					subI = i;
	  					break;  					
	  				};
	  				
	  			};
	  			
	  		};
	  	}; 	
	  	
	  	res.json(sendDatabases);
	  	db.close();
	});    

    
  });	


});

router.route('/listcollections/:database').get((req, res) => {
	sendCollections = [];
	sendDatabases = [];

	var databaseName = req.params.database;
	sendCollections = [];
	MongoClient.connect(urlProducts, function(err, db) {
		if (err) throw err;
  		var dbo = db.db(databaseName);
  		database = dbo;

  		dbo.collections((err, recivedCollections) => {

	  		for(var i=0; i<recivedCollections.length; i++) {
	  			sendCollections[i] = recivedCollections[i].s.name;
	  			
	  		};	  		
  			res.json(sendCollections);
  		
  		}); 
  		db.close();
	});
			
});

router.route('/createdatabase/:database/:collection').get((req, res) => {
	var databaseName = req.params.database;
	var collection = req.params.collection;
	var newUrl = urlProducts ;

	
	MongoClient.connect(newUrl, function(err, db) {
		if (err) throw err;
  		var dbo = db.db(databaseName);
  		
  		dbo.createCollection(collection, (error, result) => {
    		if (error) throw error;
    		
    		
    	});	
  		 		
  		//db.close();
	});
			
});

router.route('/createcollection/:database/:collection').get((req, res) => {
	var databaseName = req.params.database;
	var collection = req.params.collection;
	var newUrl = urlProducts ;
	
	MongoClient.connect(newUrl, function(err, db) {
		if (err) throw err;
  		var dbo = db.db(databaseName);  		
  		
  		dbo.createCollection(collection, (error, result) => {
    		if (error) throw error;
    		
    	});	
  		 		
  		
	});
			
});

router.route('/deletecollection/:database/:collection').get((req, res) => {
	var databaseName = req.params.database;
	var collection = req.params.collection;
	var newUrl = urlProducts + databaseName;
	MongoClient.connect(newUrl, function(err, db) {
		if (err) throw err;
  		var dbo = db.db();
  		database = dbo;


  		dbo.dropCollection(collection, (error, result) => {
  			
  		});

  		

  		
  		
	});
			
});


router.route('/deletedatabase/:database').get((req, res) => {
	var databaseName = req.params.database;
	var newUrl = urlProducts + databaseName;
	MongoClient.connect(newUrl, function(err, db) {
		if (err) throw err;
  		var dbo = db.db();
  		database = dbo;

  		dbo.dropDatabase((error, result) => {
  			
  		});

  		
  		
	});
			
});




module.exports = router