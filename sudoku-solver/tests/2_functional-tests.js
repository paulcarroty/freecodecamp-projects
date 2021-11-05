const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const testStrings =
  require("../controllers/puzzle-strings").puzzlesAndSolutions;

suite("Functional Tests", () => {
  suite("POST request to (/api/solve)", () => {
    test("Solve a valid puzzle", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testStrings[0][0] })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200) &&
            assert.equal(res.body.solution, testStrings[0][1]);
          done();
        });
    });

    test("Solve a puzzle with a missing string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200) &&
            assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testStrings[1][0].replace("1", "one") })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200) &&
            assert.equal(res.body.error, "Invalid characters");
          done();
        });
    });

    test("Puzzle with incorrect length", (done) => {
      const puzzle = testStrings[2][0].substring(0, 70);
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200) &&
            assert.equal(res.body.error, "Puzzle should be 81 characters long");
          done();
        });
    });

    test("Puzzle that cannot be solved", (done) => {
      const puzzle = testStrings[3][0].replace(".", "0");
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200) &&
            assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST request to (/api/check)", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[4][0],
          coordinate: "A1",
          value: "8",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0],
          coordinate: "A2",
          value: "1",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 2);
          assert.equal(res.body.conflict[0], "row");
          done();
        });
    });

    test("Check a puzzle with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0],
          coordinate: "A2",
          value: "1",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 2);
          done();
        });
    });

    test("Check a puzzle with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0],
          coordinate: "A2",
          value: "2",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 3);
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          coordinate: "A1",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0].replace(".", "%"),
          coordinate: "A4",
          value: "7",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      const puzzle = testStrings[2][0].substring(0, 8);
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle,
          coordinate: "A1",
          value: "2",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle should be 81 characters long");
          done();
        });
    });

    test("Check a puzzle with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0],
          coordinate: "Z1",
          value: "1",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[4][0],
          coordinate: "A3",
          value: "111",
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
