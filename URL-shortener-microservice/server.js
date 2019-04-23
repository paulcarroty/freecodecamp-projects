"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");
const dns = require("dns");
const urlParse = require("url");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

let shortURLcount = 0;
let URLisREAL;  // for fake link detection
let URLS = {}; // key-value storage for link/shortlinks

// DNS options
const options = {
  family: 4,
  hints: dns.ADDRCONFIG | dns.V4MAPPED
};

/** this project needs a db !! **/

mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

// /api/shorturl/new endpoint
app.post("/api/shorturl/new", (req, res) => {
  let postBody = req.body.url;
  console.log("We got a POST request! ", postBody);

  // verify link by DNS
  dns.lookup(urlParse.parse(postBody).hostname, options, (err, address) => {
    err
      ? URLisREAL = false
      : URLisREAL = true;
    
    URLisREAL ? (URLS[postBody] = ++shortURLcount) : '';
    
     URLisREAL
    ? res.json({ original_url: postBody, short_url: 'https://url-shortener-microserv1ce.glitch.me/api/shorturl/' + shortURLcount })
    : res.json({ error: "invalid URL" });
    });

  });
  
  
    

app.get('/api/shorturl/:shortlink', function(req, res, next) {
  next();
});

app.use('/api/shorturl/:shortlink', function(req, res, next) {
  console.log('shortlink: ', req.params.shortlink);
  console.log('URLS: ', URLS)
 
  
// find link in DB  
let link = Object.keys(URLS).find(e => URLS[e] == req.params.shortlink);
  console.log('link: ', link);

    
  link == undefined 
  ? res.json({error: 'No URL in DB! Please add at least one.'})
  : res.redirect(link);
   
});



app.listen(port, function() {
  console.log("Node.js listening ...");
});
