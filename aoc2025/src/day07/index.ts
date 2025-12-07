import run from "aocrunner";
import { memoize, toSetToken } from "../utils/index.js";

type Coordinate = { y : number; x: number };

const parseInput = (rawInput: string) => {
  const grid = rawInput.split("\n").map((line) => line.split(""));

  const reflectors: Record<string, Coordinate> = {};
  let start: Coordinate = { y: 0, x: 0 };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "S") {
        start = { y, x };
      } else if (grid[y][x] === "^") {
        const coord = { x, y };
        reflectors[toSetToken(coord)] = coord;
      }
    }
  }

  return { grid, reflectors, start }
}

const part1 = (rawInput: string) => {
  const { grid, reflectors, start } = parseInput(rawInput);

  let row = start.y
  const currentBeams: Coordinate[] = [start]
  let splits = 0;

  while (row != grid.length) {
    const nextBeams: Record<string, Coordinate> = {};
    while (currentBeams.length > 0) {
      const beam = currentBeams.pop()!!;
      beam.y++;

      if (reflectors[toSetToken(beam)]) {
        splits++;
        const left = { y: beam.y, x: beam.x - 1};
        const right = { y: beam.y, x: beam.x + 1};

        nextBeams[toSetToken(left)] = left;
        nextBeams[toSetToken(right)] = right;
      } else {
        nextBeams[toSetToken(beam)] = beam;
      }
    }
    currentBeams.push(...Object.values(nextBeams));

    row++;
  }

  return splits;
};

const countPathsFromBeam = memoize((beam: Coordinate, rowMax: number, reflectors: Record<string, Coordinate>): number => {
  beam.y++;

  if (beam.y === rowMax) {
    return 1;
  }

  if (reflectors[toSetToken(beam)]) {
    const left = { y: beam.y, x: beam.x - 1};
    const right = { y: beam.y, x: beam.x + 1};

    return countPathsFromBeam(left, rowMax, reflectors)
      + countPathsFromBeam(right, rowMax, reflectors);
  } else {
    return countPathsFromBeam(beam, rowMax, reflectors);
  }
});

const part2 = (rawInput: string) => {
  const { grid, reflectors, start } = parseInput(rawInput);
  return countPathsFromBeam(start, grid.length - 1, reflectors);
};

run({
  part1: {
    tests: [
      {
        input: `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
