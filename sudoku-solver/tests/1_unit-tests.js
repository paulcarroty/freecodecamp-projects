const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const testStrings =
  require("../controllers/puzzle-strings").puzzlesAndSolutions;

suite("UnitTests", () => {
  test("Valid puzzle string of 81 characters", (done) => {
    const puzzle = testStrings[0][0];
    assert.lengthOf(puzzle, 81);
    assert.isNotFalse(solver.validate(puzzle).isValid);
    done();
  });

  test("Puzzle string with invalid characters (not 1-9 or .)", (done) => {
    const puzzle = testStrings[0][0].replace(".", "#");
    assert.isFalse(solver.validate(puzzle).isValid);
    assert.deepEqual(solver.validate(puzzle).error, "Invalid characters");
    done();
  });

  test("Puzzle string that is not 81 characters in length", (done) => {
    const puzzle = testStrings[0][0].replace(".", "");
    assert.lengthOf(puzzle, 80);
    assert.isFalse(solver.validate(puzzle).isValid);
    assert.deepEqual(
      solver.validate(puzzle).error,
      "Puzzle should be 81 characters long"
    );
    done();
  });

  test("Valid row placement", (done) => {
    const puzzle = solver.validate(testStrings[0][0]).result,
      row = "A",
      column = 1,
      value = 1;
    assert.isTrue(solver.checkRowPlacement(puzzle, row, column, value));
    done();
  });

  test("Invalid row placement", (done) => {
    const puzzle = solver.validate(testStrings[1][0]).result,
      row = "A",
      column = 2,
      value = 5;
    assert.equal(solver.checkRowPlacement(puzzle, row, column, value), "row");
    done();
  });

  test("Valid column placement", (done) => {
    const puzzle = solver.validate(testStrings[2][0]).result,
      row = "A",
      column = 1,
      value = 2;
    assert.isTrue(solver.checkColPlacement(puzzle, row, column, value));
    done();
  });

  test("Invalid column placement", (done) => {
    const puzzle = solver.validate(testStrings[2][0]).result,
      row = "A",
      column = 1,
      value = 7;
    assert.equal(
      solver.checkColPlacement(puzzle, row, column, value),
      "column"
    );
    done();
  });

  test("Valid region (3x3 grid) placement", (done) => {
    const puzzle = solver.validate(testStrings[3][0]).result,
      row = "A",
      col = 1,
      value = 4;
    assert.isTrue(solver.checkRegionPlacement(puzzle, row, col, value));
    done();
  });

  test("Invalid region (3x3 grid) placement", (done) => {
    const puzzle = solver.validate(testStrings[3][0]).result,
      row = "A",
      col = 1,
      value = 7;
    assert.equal(
      solver.checkRegionPlacement(puzzle, row, col, value),
      "region"
    );
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    const incompletePuzzle = testStrings[0][0],
      completePuzzle = testStrings[0][1],
      validatedPuzzle = solver.validate(incompletePuzzle).result;
    assert.equal(solver.solve(validatedPuzzle), completePuzzle);
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    const invalidPuzzle = testStrings[0][0].replace(".", "1"),
      validatedPuzzle = solver.validate(invalidPuzzle).result;
    assert.isFalse(solver.solve(validatedPuzzle));
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    const incompletePuzzle = testStrings[4][0],
      completedPuzzle = testStrings[4][1],
      validatedPuzzle = solver.validate(incompletePuzzle).result;
    // mark last element as unsolved
    validatedPuzzle[8][8] = ".";
    assert.equal(solver.solve(validatedPuzzle), completedPuzzle);
    done();
  });
});
