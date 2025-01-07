import run from "aocrunner";

type Coordinate = { y: number, x: number };

const parseInput = (rawInput: string) => {
  const grid = rawInput.split("\n").map(line => line.split(""));
  const ySize = grid.length;
  const xSize = grid[0].length;

  const trees: Coordinate[] = [];
  for (let y = 0; y < ySize; y++) {
    for (let x = 0; x < xSize; x++) {
      if (grid[y][x] === "#") {
        trees.push({ y, x });
      }
    }
  }
  return { trees, xSize, ySize };
}

const runSlope = (ySlope: number, xSlope: number, ySize: number, xSize:number, trees: Coordinate[]) => {
  let y = 0;
  let x = 0;
  let treesHit = 0;
  while (y < ySize) {
    x = (x + xSlope) % xSize;
    y += ySlope;

    if (trees.find(tree => tree.y === y && tree.x === x )) {
      treesHit++;
    }
  }

  return treesHit;
}

const part1 = (rawInput: string) => {
  const { trees, xSize, ySize } = parseInput(rawInput);

  return runSlope(1, 3, ySize, xSize, trees);
};

const part2 = (rawInput: string) => {
  const { trees, xSize, ySize } = parseInput(rawInput);

  return [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].reduce((acc, curr) => {
    let count = runSlope(curr[1], curr[0], ySize, xSize, trees);
    return count * acc;
  }, 1);
};

run({
  part1: {
    tests: [
      {
        input: `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`,
        expected: 336,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
