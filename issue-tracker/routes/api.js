 /*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var ObjectId = require("mongodb").ObjectID;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = "issues";
const url = process.env.MONGO_URI;


module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      var project = req.params.project;
      const query = req.query;
    
      let cleanQuery = Object.fromEntries(
          Object.entries(query).filter(v => v[1] !== "")
      );
    
      if (cleanQuery.open === 'false') cleanQuery.open = false;
      if (cleanQuery.open === 'true') cleanQuery.open = true;
      if (cleanQuery.hasOwnProperty('_id')) cleanQuery._id = ObjectId(cleanQuery._id)
          
      const client = new MongoClient(url, { useNewUrlParser: true });

        try {
          await client.connect();
          console.log("Connected correctly to server");

          const db = client.db(dbName);
          let collection = db.collection(project);
          let docs = await collection.find(cleanQuery).toArray();
          res.json(docs);
          
        } catch (err) {
          console.log(err.stack);
        }

        // Close connection
        client.close();

    
    })

    .post(async (req, res) => {
      const project = req.params.project;
      const body = req.body;
      let issue = {
        issue_title: body.issue_title,
        issue_text: body.issue_text,
        created_by: body.created_by,
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: body.assigned_to || "",
        status_text: body.status_text || "",
        open: true
      };

      if (
        issue.issue_title === undefined ||
        issue.issue_text === undefined  ||
        issue.created_by === undefined
      ) {
        res.send("Invalid field, try again!");
      } else {
        // write new issue to DB
        res.json(issue);
        const client = new MongoClient(url, { useNewUrlParser: true });

        try {
          await client.connect();
          console.log("Connected correctly to server");

          const db = client.db(dbName);

          // Insert a single document
          let r = await db.collection(project).insertOne(issue);
          assert.equal(1, r.insertedCount);
          
        } catch (err) {
          console.log(err.stack);
        }

        // Close connection
        client.close();
      }
    })

    .put(async (req, res) => {
      const project = req.params.project;
      const body = req.body;
      const _id = body._id;
    
      try {
      
      ObjectId(_id)
      
      } catch(err){
      res.send("_id error")
      }
    
     let cleanQuery = Object.fromEntries(
          Object.entries(body).filter(v => v[1] !== '' && v[0] !== '_id')
      );
    
    
     if (cleanQuery.open === 'false') cleanQuery.open = false;
     if (cleanQuery.open === 'true')  cleanQuery.open = true;
    
    
    if (body.hasOwnProperty('_id')){
       
    cleanQuery.updated_on = new Date();
      
      
      
    const client = new MongoClient(url, { useNewUrlParser: true });
       
    try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db(dbName);
    const col = db.collection(project);
    let r;

    // Update a single document
    r = await col.updateOne({_id: ObjectId(_id)}, {$set: cleanQuery});
    assert.equal(1, r.matchedCount)
    assert.equal(1, r.modifiedCount)

    if(Object.keys(cleanQuery).length < 2) res.send('no updated field sent');
    else if(r.modifiedCount != 1) res.send('could not update ' +  _id);
    else res.send('successfully updated ' + _id); 

   } catch (err) {
      console.log(err.stack);
   }
  

  // Close connection
  client.close();
            
       
  }
    
})

    .delete(async (req, res) => {
    
      const project = req.params.project;
      const _id = req.body._id;
      console.log('_id ' + _id);
    
     if(_id === undefined){
      res.send("_id error");
     } else {
      
    try{
      
      ObjectId(_id)
      
    } catch(err){
      res.send("_id error")
    }

    
    
    const client = new MongoClient(url, { useNewUrlParser: true });
    
    try {
      
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
      const col = db.collection(project);
      let r;

      // Update a single document
      r = await col.findOneAndDelete({_id: ObjectId(_id)});
      // console.log('r: ', r)

      if(r.ok == 1) res.send('deleted ' + _id)
      else res.send('could not delete ' + _id);

   } catch (err) {
     console.log(err.stack);
   }
  
  // Close connection
  client.close();
}
    });
    
  
};
 