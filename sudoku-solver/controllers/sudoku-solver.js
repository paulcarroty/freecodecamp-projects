class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81)
      return {
        isValid: false,
        error: "Puzzle should be 81 characters long",
      };

    if (!/^[\d.]+$/gi.test(puzzleString))
      return { isValid: false, error: "Invalid characters" };

    // convert puzzle string to nested array [[],[]...]
    const puzzle = puzzleString
      .split("")
      .reduce(
        (a, c, i, arr) => (i % 9 == 0 ? [...a, arr.slice(i, i + 9)] : a),
        []
      );
    return { isValid: true, result: puzzle };
  }

  rowToNumber(row) {
    // converts A-I row index to 0-8 number
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    return rows.indexOf(row);
  }

  checkRowPlacement(puzzle, row, column, value) {
    row = this.rowToNumber(row);
    column -= 1; // 'cause array count begins from 0
    puzzle[row].splice(column, 1);
    return puzzle[row].includes(value.toString()) ? "row" : true;
  }

  checkColPlacement(puzzle, row, column, value) {
    row = this.rowToNumber(row);
    column -= 1; // 'cause array count begins from 0
    puzzle = puzzle.map((e) => e[column]);
    puzzle.splice(row, 1);
    return puzzle.includes(value.toString()) ? "column" : true;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    row = this.rowToNumber(row);
    column -= 1; // 'cause array count begins from 0
    // let result = true;
    // calculate the local 3x3 quadrat coordinates
    for (let i = 0; i < 9; i++) {
      // width = position_inside_third + number_of_third = [000333666] + [000111222]
      const width = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      // height = position_inside_third + number_of_third = [000333666] + [012012012]
      const height = 3 * Math.floor(column / 3) + (i % 3);
      if (value == puzzle[width][height]) return "region";
    }
    return true;
  }

  isValid(puzzle, row, column, guess) {
    // calculate the local 3x3 quadrat coordinates
    for (let i = 0; i < 9; i++) {
      // width = position_inside_third + number_of_third = [000333666] + [000111222]
      const width = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      // height = position_inside_third + number_of_third = [000333666] + [012012012]
      const height = 3 * Math.floor(column / 3) + (i % 3);
      if (
        puzzle[row][i] == guess ||
        puzzle[i][column] == guess ||
        puzzle[width][height] == guess
      ) {
        return false;
      }
    }
    return true;
  }

  solve(puzzle) {
    // backtracking algorithm
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] == ".") {
          for (let guess = 1; guess <= 9; guess++) {
            if (this.isValid(puzzle, row, col, guess)) {
              // add guess to puzzle
              puzzle[row][col] = guess;
              // convert to string
              if (this.solve(puzzle)) {
                return puzzle.toString().replace(/,/g, "");
              } else {
                // step back if check failed
                puzzle[row][col] = ".";
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;
