// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// /hello API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({
    greeting:
      'Hello! This is timestamp microservice API! Please use "/api/timestamp/YOUR_DATE!"'
  });
});

// /timestamp API
app.get("/api/timestamp/:date", (req, res) => {
  console.log(req.method, req.path, req.ip);
  let date = req.params.date;
  console.log(date);
  let d = new Date(date).toUTCString();
  d == "Invalid Date"
    ? res.json({ error: "Invalid Date" })
    : res.json({ unix: new Date(date).getTime(), utc: d });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
