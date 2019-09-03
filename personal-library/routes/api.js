/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const assert = require("assert");
const url = process.env.MONGO_URI;
const dbName = "books";
const dbCollection = "books";

module.exports = function(app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        let collection = db.collection(dbCollection);
        let docs = await collection.find().toArray();
        await docs.map(e =>
          e.hasOwnProperty("comments")
            ? (e.commentcount = e.comments.length)
            : (e.commentcount = 0)
        );
        res.json(docs);
        // console.log(docs);
      } catch (err) {
        console.log(err.stack);
      } finally {
        client.close();
      }
    })

    .post(async (req, res) => {
      const title = req.body.title;
      // console.log("Title: ", title);
      // response will contain new book object including at least _id and title
      if (
        ["  ", "   ", undefined, null, NaN, 0, false].includes(title) ||
        title.length < 5
      )
        return res.send("Bad title");

      const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // Insert a single document
        let r = await db.collection(dbCollection).insertOne({ title });
        let newId = await r.insertedId;
        if (newId) {
          res.json({ _id: newId, title, comments: [] });
          console.log(`Successfully inserted item with id: ${newId}`);
        }
        assert.equal(1, r.insertedCount);
      } catch (err) {
        console.log(err.stack);
      } finally {
        client.close();
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        const col = db.collection(dbCollection);
        let r;
        r = await col.deleteMany({});
        console.log(r);
        if (r.result.ok === 1) res.send("complete delete successful");
        else res.send("complete delete unsuccessful");
      } catch (err) {
        console.log(err.stack);
      } finally {
        client.close();
      }
    });

  app
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    .route("/api/books/:id")
    .get(async (req, res) => {
      const bookId = req.params.id;
      if (!ObjectId.isValid(bookId)) return res.send("invalid book id");

      const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        let collection = db.collection(dbCollection);
        let doc = await collection.findOne({ _id: ObjectId(bookId) });
        return res.json(doc);
      } catch (err) {
        console.log(err.stack);
      } finally {
        client.close();
      }
    })

    .post(async (req, res) => {
      // add comment to book
      //json res format same as .get
      const bookId = req.params.id;
      const comment = req.body.comment;
      console.log(bookId, comment);
      if (!ObjectId.isValid(bookId)) return res.send("invalid book id");

      const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        let collection = db.collection(dbCollection);
        let doc = await collection.findOneAndUpdate(
          { _id: ObjectId(bookId) },
          { $push: { comments: comment } },
          { returnOriginal: false, returnNewDocument: true }
        );
        return res.json(doc.value);
      } catch (err) {
        console.log(err.stack);
      } finally {
        client.close();
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'delete successful'
      const bookId = req.params.id;
      if (!ObjectId.isValid(bookId)) return res.send("invalid book id");

      const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        const col = db.collection(dbCollection);
        let r;
        r = await col.findOneAndDelete({ _id: ObjectId(bookId) });
        if (r.ok === 1) res.send("delete successful");
        else res.send("complete delete unsuccessful");
      } catch (err) {
        console.log(err.stack);
      } finally {
        client.close();
      }
    });
};
