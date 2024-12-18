import run from "aocrunner";
import { basicGenerateNeighbors, DijkstrasCoordinate, runDijkstras } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n").map((line) =>
  line.split(",").map(v => Number.parseInt(v, 10)));

const generateNeighbors = basicGenerateNeighbors;

const part1 = (rawInput: string) => {
  const incomingBytes = parseInput(rawInput);
  const gridSize = incomingBytes.length > 25 ? 71 : 7;
  const iterations = incomingBytes.length > 25 ? 1024 : 12;

  const grid: number[][] = Array(gridSize).fill(null).map(_ => Array(gridSize).fill(1));

  for (let i = 0; i < iterations; i++) {
    const nextByte = incomingBytes.splice(0, 1)[0];
    grid[nextByte[1]][nextByte[0]] = Number.POSITIVE_INFINITY;
  }

  return runDijkstras(grid, [0, 0], [gridSize - 1, gridSize - 1], generateNeighbors);
};

const part2 = (rawInput: string) => {
  const incomingBytes = parseInput(rawInput);
  const initialLength = incomingBytes.length;
  const gridSize = incomingBytes.length > 25 ? 71 : 7;

  const grid: number[][] = Array(gridSize).fill(null).map(_ => Array(gridSize).fill(1));

  for (let i = 0; i < initialLength; i++) {
    if (i % 10 === 0) {
      console.log(`Iteration ${i}`);
    }

    const nextByte = incomingBytes.splice(0, 1)[0];
    grid[nextByte[1]][nextByte[0]] = Number.POSITIVE_INFINITY;

    const pathLength = runDijkstras(grid, [0, 0], [gridSize - 1, gridSize - 1], generateNeighbors);
    if (pathLength === Number.POSITIVE_INFINITY) {
      return nextByte.join(",");
    }
  }

  // for (let y = 0; y < gridSize; y++) {
  //   let line = "";
  //   for (let x = 0; x < gridSize; x++) {
  //     if (grid[y][x] === 1) {
  //       line += "."
  //     } else {
  //       line += "#"
  //     }
  //   }
  //   console.log(line);
  // }

  return "-1,-1";
};

run({
  part1: {
    tests: [
      {
        input: `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`,
        expected: 22,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`,
        expected: "6,1",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
