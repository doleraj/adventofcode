import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => line.split(""));
}

const inBounds = (y: number, x: number, input: string[][]): boolean => {
  return y >= 0 && y < input.length && x >= 0 && x < input[0].length;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  var instances = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const char = input[y][x];

      if (char !== "X") {
        continue;
      }

      // Moving right
      if (inBounds(y, x + 1, input) && input[y][x + 1] === "M"
        && inBounds(y, x + 2, input) && input[y][x + 2] === "A"
        && inBounds(y, x + 3, input) && input[y][x + 3] === "S") {
          instances += 1;
      }
      // Moving down-right
      if (inBounds(y + 1, x + 1, input) && input[y + 1][x + 1] === "M"
        && inBounds(y + 2, x + 2, input) && input[y + 2][x + 2] === "A"
        && inBounds(y + 3, x + 3, input) && input[y + 3][x + 3] === "S") {
        instances += 1;
      }
      // Moving down
      if (inBounds(y + 1, x, input) && input[y + 1][x] === "M"
        && inBounds(y + 2, x, input) && input[y + 2][x] === "A"
        && inBounds(y + 3, x, input) && input[y + 3][x] === "S") {
        instances += 1;
      }
      // Moving down-left
      if (inBounds(y + 1, x - 1, input) && input[y + 1][x - 1] === "M"
        && inBounds(y + 2, x - 2, input) && input[y + 2][x - 2] === "A"
        && inBounds(y + 3, x - 3, input) && input[y + 3][x - 3] === "S") {
        instances += 1;
      }
      // Moving left
      if (inBounds(y, x - 1, input) && input[y][x - 1] === "M"
        && inBounds(y, x - 2, input) && input[y][x - 2] === "A"
        && inBounds(y, x - 3, input) && input[y][x - 3] === "S") {
        instances += 1;
      }
      // Moving up-left
      if (inBounds(y - 1, x - 1, input) && input[y - 1][x - 1] === "M"
        && inBounds(y - 2, x - 2, input) && input[y - 2][x - 2] === "A"
        && inBounds(y - 3, x - 3, input) && input[y - 3][x - 3] === "S") {
        instances += 1;
      }
      // Moving up
      if (inBounds(y - 1, x, input) && input[y - 1][x] === "M"
        && inBounds(y - 2, x, input) && input[y - 2][x] === "A"
        && inBounds(y - 3, x, input) && input[y - 3][x] === "S") {
        instances += 1;
      }
      // Moving up-right
      if (inBounds(y - 1, x + 1, input) && input[y - 1][x + 1] === "M"
        && inBounds(y - 2, x + 2, input) && input[y - 2][x + 2] === "A"
        && inBounds(y - 3, x + 3, input) && input[y - 3][x + 3] === "S") {
        instances += 1;
      }
    }
  }

  return instances;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  var instances = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const char = input[y][x];

      if (char !== "A" || y === 0 || x === 0 || y === input.length - 1 || x === input[0].length - 1) {
        continue;
      }

      // Look for a MAS or SAM up-left and down-right, and down-left and up-right
      const validUpLeftAndDownRight = (input[y - 1][x - 1] === "M" && input[y + 1][x + 1] === "S")
                                           || (input[y - 1][x - 1] === "S" && input[y + 1][x + 1] === "M");
      const validDownLeftAndUpRight = (input[y + 1][x - 1] === "M" && input[y - 1][x + 1] === "S")
                                           || (input[y + 1][x - 1] === "S" && input[y - 1][x + 1] === "M");
      if (validUpLeftAndDownRight && validDownLeftAndUpRight) {
        instances += 1;
      }
    }
  }
  return instances;
};

run({
  part1: {
    tests: [
      {
        input: `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9,
      },
    ],
    // 2022 too high.
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
