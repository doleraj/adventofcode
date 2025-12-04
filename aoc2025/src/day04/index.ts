import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput
  .split("\n")
  .map((line) => line.split(""));

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

type Roll = { y: number, x: number };
type RollWithNeighborCount = { y: number, x: number, neighborCount: number };

const findRemovableRolls = (rolls: Roll[], grid: string[][]) => {
  return rolls.map(roll => {
      const neighborCount = directions.reduce((acc, dirMod) => {
        const newY = roll.y + dirMod[0];
        const newX = roll.x + dirMod[1];

        if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[0].length) {
          return acc;
        }

        return acc + (grid[newY][newX] === "@" ? 1 : 0);
      }, 0);

      return { y: roll.y, x: roll.x, neighborCount } as RollWithNeighborCount;
    }).filter(roll => roll.neighborCount < 4);
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const rolls = grid
    .flatMap((line, y) => line.map((node, x) => ({ y, x, c: node })))
    .filter(node => node.c === "@");

  return findRemovableRolls(rolls, grid).length;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  let removedRolls = -1;
  let totalRemoved = 0;

  while (removedRolls !== 0) {
    const currentRolls = grid
      .flatMap((line, y) => line.map((node, x) => ({ y, x, c: node })))
      .filter(node => node.c === "@");

    const removableRolls = findRemovableRolls(currentRolls, grid);

    removedRolls = removableRolls.length;
    totalRemoved += removableRolls.length;
    removableRolls.forEach((roll) => {
      grid[roll.y][roll.x] = ".";
    });

  }

  return totalRemoved;
};

run({
  part1: {
    tests: [
      {
        input: `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
