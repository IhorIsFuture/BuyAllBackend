import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
//import Computers from './moduls/computers';
//import Phones from './moduls/phones';
import DatabaseInfo from './moduls/databaseinfo';
import UniversalProducts from './moduls/universalrequests';
import Users from './moduls/users';


import Mongo from 'mongodb';

var MongoClient = Mongo.MongoClient;
var urlProducts = "mongodb://localhost:27017/products";
var database;
var sendCollections = [];
var sendDatabases = [];

MongoClient.connect(urlProducts, function(err, db) {
  if (err) throw err;
  var dbo = db.db();
  /*dbo.createCollection("shirts", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    
  });*/
  db.close();
 database = dbo;  
});

 



const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
//app.use('/products', Computers);
//app.use('/products', Phones);
app.use('/universalProducts', UniversalProducts);
app.use('/database', DatabaseInfo);
app.use('/users', Users);


//MongoClient();




//app.use('/', router);



app.listen(4000, () => {
	console.log('Express server running on port 4000');
});
