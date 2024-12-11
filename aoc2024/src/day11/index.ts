import run from "aocrunner";
import { memoize } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split(" ").map(char => Number.parseInt(char));

const generateStones = (stone: number, iteration: number, maxIterations: number): number[] => {
  if (iteration === maxIterations) {
    return [stone];
  }

  if (stone === 0) {
    return generateStones(1, iteration + 1, maxIterations);
  } else if (stone.toString().length % 2 === 0) {
    const stoneString = stone.toString();
    return [
      ...generateStones(Number.parseInt(stoneString.substring(0, stoneString.length / 2)), iteration + 1, maxIterations),
      ...generateStones(Number.parseInt(stoneString.substring(stoneString.length / 2)), iteration + 1, maxIterations)
    ];
  } else {
    return generateStones(stone * 2024, iteration + 1, maxIterations);
  }
};

const generateStones2 = memoize((stone: number, iteration: number, maxIterations: number): number => {
  if (iteration === maxIterations) {
    return 1;
  }

  if (stone === 0) {
    return generateStones2(1, iteration + 1, maxIterations);
  } else if (stone.toString().length % 2 === 0) {
    const stoneString = stone.toString();
    return generateStones2(Number.parseInt(stoneString.substring(0, stoneString.length / 2)), iteration + 1, maxIterations)
      + generateStones2(Number.parseInt(stoneString.substring(stoneString.length / 2)), iteration + 1, maxIterations)
  } else {
    return generateStones2(stone * 2024, iteration + 1, maxIterations);
  }
}, (stone: number, iteration: number) => `${stone}-${iteration}`);

const part1 = (rawInput: string) => {
  let stones = parseInput(rawInput);

  stones = stones.flatMap(stone => generateStones(stone, 0, 25));
  return stones.length;
};

const part2 = (rawInput: string) => {
  let stones = parseInput(rawInput);

  return stones.reduce((acc, stone) => acc + generateStones2(stone, 0, 75), 0);
};

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected: 55312,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
