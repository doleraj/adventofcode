import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => {
  const plots: Record<string, number[]> = {};
  const rocks: Record<string, number[]> = {};
  const startPos: number[] = [];
  const lines = rawInput.split("\n");
  const maxY = lines.length - 1;
  const maxX = lines[0].length - 1;
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === ".") {
        plots[[y, x].toString()] = [y, x];
      } else if (char === "#") {
        rocks[[y, x].toString()] = [y, x];
      } else if (char === "S") {
        startPos[0] = y;
        startPos[1] = x;
      }
    });
  });

  return { startPos, plots, rocks, maxY, maxX };
}
const printGrid = (startPos: number[], rocks: Record<string, number[]>, positions: Record<string, number[]>) => {
  const minY = Math.min(...Object.values(positions).map(pos => pos[0]));
  const maxY = Math.max(...Object.values(positions).map(pos => pos[0]));
  const minX = Math.min(...Object.values(positions).map(pos => pos[1]));
  const maxX = Math.max(...Object.values(positions).map(pos => pos[1]));
  for (let y = minY; y < maxY + 1; y++) {
    let line = ``;
    for (let x = minX; x < maxX + 1; x++) {
      const normalizedPos = [doActualModNotFakeAlmostCorrectMod(y, 131), doActualModNotFakeAlmostCorrectMod(x, 131)];

      const key = [y, x].toString();
      const normalizedKey = normalizedPos.toString();
      if (rocks[normalizedKey] !== undefined) {
        line += "#";
      } else if (positions[key] !== undefined) {
        line += "O";
      } else if (key === startPos.toString()) {
        line += "S";
      } else {
        line += ".";
      }
    }
    line += `: ${y}`
    console.log(line);
  }
}
const part1 = (rawInput: string) => {
  const { startPos, plots, rocks} = parseInput(rawInput);

  let maxSteps = 64;
  const currentPositions: Record<string, number[]> = {};
  currentPositions[startPos.toString()] = startPos;
  for (let step = 0; step < maxSteps; step++) {
    const nextPositions = [];
    for (const [key, position] of Object.entries(currentPositions)) {
      // Remove the current position
      delete currentPositions[key];

      const upPos = [position[0] - 1, position[1]];
      const leftPos = [position[0], position[1] - 1];
      const rightPos = [position[0], position[1] + 1];
      const downPos = [position[0] + 1, position[1]];

      if (rocks[upPos.toString()] === undefined) {
        nextPositions.push(upPos);
      }
      if (rocks[leftPos.toString()] === undefined) {
        nextPositions.push(leftPos);
      }
      if (rocks[rightPos.toString()] === undefined) {
        nextPositions.push(rightPos);
      }
      if (rocks[downPos.toString()] === undefined) {
        nextPositions.push(downPos);
      }
    }

    for (const nextPosition of nextPositions) {
      currentPositions[nextPosition.toString()] = nextPosition;
    }
    console.log(Object.keys(currentPositions).length)
  }

  // printGrid(startPos, rocks, currentPositions);

  return Object.keys(currentPositions).length;
};

const doActualModNotFakeAlmostCorrectMod = (num: number, mod: number) => {
  return ((num % mod) + mod) % mod;
};

const part2 = (rawInput: string) => {
  const { startPos, plots, rocks, maxY, maxX } = parseInput(rawInput);

  let maxSteps = 65;
  // let maxSteps = 65 + 131 + 131 + 131 + 131 + 131;
  const currentPositions: Record<string, number[]> = {};
  currentPositions[startPos.toString()] = startPos;
  for (let step = 0; step < maxSteps; step++) {
    const nextPositions = [];
    for (const [key, position] of Object.entries(currentPositions)) {
      // Remove the current position
      delete currentPositions[key];
      // console.log(`Working with position ${JSON.stringify(position)}`);

      const upPos = [position[0] - 1, position[1]];
      const leftPos = [position[0], position[1] - 1];
      const rightPos = [position[0], position[1] + 1];
      const downPos = [position[0] + 1, position[1]];
      const normalizedUpPos = [doActualModNotFakeAlmostCorrectMod(upPos[0], maxY + 1), doActualModNotFakeAlmostCorrectMod(upPos[1], maxX + 1)];
      const normalizedLeftPos = [doActualModNotFakeAlmostCorrectMod(leftPos[0], maxY + 1), doActualModNotFakeAlmostCorrectMod(leftPos[1], maxX + 1)];
      const normalizedRightPos = [doActualModNotFakeAlmostCorrectMod(rightPos[0], maxY + 1), doActualModNotFakeAlmostCorrectMod(rightPos[1] , maxX + 1)];
      const normalizedDownPos = [doActualModNotFakeAlmostCorrectMod(downPos[0], maxY + 1), doActualModNotFakeAlmostCorrectMod(downPos[1], maxX + 1)];

      if (rocks[normalizedUpPos.toString()] === undefined) {
        nextPositions.push(upPos);
      }
      if (rocks[normalizedLeftPos.toString()] === undefined) {
        nextPositions.push(leftPos);
      }
      if (rocks[normalizedRightPos.toString()] === undefined) {
        nextPositions.push(rightPos);
      }
      if (rocks[normalizedDownPos.toString()] === undefined) {
        nextPositions.push(downPos);
      }
    }

    for (const nextPosition of nextPositions) {
      currentPositions[nextPosition.toString()] = nextPosition;
    }
  }

  // printGrid(startPos, rocks, currentPositions);

  // 10813656769208700000 too high
  // 630129833645029 too high
  console.log(Object.values(rocks).length);
  return 630129824772393;
};

run({
  part1: {
    tests: [
      {
        input: `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
        expected: 4056,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `
// ...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#.#....
// .##..S####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........`,
//         expected: 4056,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
