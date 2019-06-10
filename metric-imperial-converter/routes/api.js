/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function(app) {
  var convertHandler = new ConvertHandler();

  app.route("/api/convert").get(function(req, res) {
    var input = req.query.input;
    var initNum = convertHandler.getNum(input);
    console.log("initNum: ", initNum);
    var initUnit = convertHandler.getUnit(input);
    console.log("initUnit: ", initUnit);

    var returnNum = convertHandler.convert(initNum, initUnit);
    console.log("returnNum: ", returnNum);

    var returnUnit = convertHandler.getReturnUnit(initUnit);
    console.log("returnUnit: ", returnUnit);

    var string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    let finalObj = { initNum, initUnit, returnNum, returnUnit, string };
    console.log("finalObj: ", finalObj);

    if (initNum == "invalid number" && initUnit == "invalid unit") {
      res.send("invalid number and unit");
    } else if (initNum == "invalid number") {
      res.send("invalid number");
    } else if (initUnit == "invalid unit") {
      res.send("invalid unit");
    } else res.json(finalObj);
  });
};
