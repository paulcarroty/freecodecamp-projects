 const uri = process.env.MONGO_URI;
const mongoose = require("mongoose"),
  Admin = mongoose.mongo.Admin;

let connection = mongoose.createConnection(uri, { useNewUrlParser: true });
connection.on("open", function() {
  // connection established
  new Admin(connection.db).listDatabases(function(err, result) {
    console.log("listDatabases succeeded");
    // database list stored in result.databases
    let allDatabases = result.databases;
    console.log(allDatabases);
  });
});

let MongoClient = require("mongodb").MongoClient,
  format = require("util").format;

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;

  let db1 = db.db("issues");

  db1.listCollections().toArray(function(err, collections) {
    console.log("LIST ALL COLLECTIONS: ", collections);
    // collections = [{"name": "coll1"}, {"name": "coll2"}]
  });

  db1
    .collection("apitest")
    .find()
    .toArray(function(err, docs) {
      console.log("PRINT THE COLLECTION : ", docs);
    });
});