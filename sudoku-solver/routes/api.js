"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const [puzzle, coordinate, value] = [
      req.body.puzzle,
      req.body.coordinate,
      req.body.value,
    ];

    if (/^.*?(?=[\^#%&$\*:<>\[\]\?\/\{\|\}]).*$/gi.test(puzzle))
      return res.json({ valid: false, error: "Invalid characters" });

    if (!/^[A-Ia-i]\d$/gi.test(coordinate))
      return res.json({ valid: false, error: "Invalid coordinate" });

    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });

    if (!/^[1-9]$/.test(value))
      return res.json({ valid: false, error: "Invalid value" });

    // puzzle, coordinate and value check
    const validation = solver.validate(puzzle);

    if (validation.error == "Puzzle should be 81 characters long")
      return res.json({
        valid: false,
        error: "Puzzle should be 81 characters long",
      });

    // handle conflict
    const [row, column] = coordinate.split("");

    let conflicts = [];
    const checkRow = solver.checkRowPlacement(
      validation.result,
      row,
      column,
      value
    );
    const checkCol = solver.checkColPlacement(
      validation.result,
      row,
      column,
      value
    );
    const checkReg = solver.checkRegionPlacement(
      validation.result,
      row,
      column,
      value
    );
    if (checkRow !== true) conflicts.push(checkRow);
    if (checkCol !== true) conflicts.push(checkCol);
    if (checkReg !== true) conflicts.push(checkReg);
    if (conflicts.length !== 0)
      return res.json({ valid: false, conflict: conflicts });

    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) return res.json({ error: "Required field missing" });

    // validation
    const validation = solver.validate(puzzle);
    if (validation?.error === "Puzzle should be 81 characters long")
      return res.json({ error: "Puzzle should be 81 characters long" });

    if (validation?.error === "Invalid characters")
      return res.json({ error: "Invalid characters" });

    // handle unsolved puzzle
    const solution = solver.solve(validation.result);
    if (!solution) return res.json({ error: "Puzzle cannot be solved" });
    res.json({ solution });
  });
};
