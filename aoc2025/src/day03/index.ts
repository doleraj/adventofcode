import run from "aocrunner";
import { memoize } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput
  .split("\n")
  .map((line) => line.split("").map(n => Number.parseInt(n)));

const part1 = (rawInput: string) => {
  const banks = parseInput(rawInput);

  return banks.reduce((acc, curr) => {
    const maxExcludingLastPlace = Math.max(...curr.slice(0, curr.length - 1));
    const maxIndex = curr.findIndex(x => x === maxExcludingLastPlace);

    const maxAfterFirstMax = Math.max(...curr.slice(maxIndex + 1, curr.length));

    return acc + (10 * maxExcludingLastPlace) + maxAfterFirstMax;
  }, 0);
};

const findBiggestNum = memoize((list: number[], power: number, skips: number) => {
  const subvalues = []

  if (power === 0) {
    return Math.max(...list);
  }

  subvalues.push((list[0] * Math.pow(10, power)) + findBiggestNum(list.slice(1), power - 1, skips));

  if (skips > 0) {
    subvalues.push(findBiggestNum(list.slice(1), power, skips - 1));
  }

  return Math.max(...subvalues);
});

const part2 = (rawInput: string) => {
  const banks = parseInput(rawInput);

  return banks.reduce((acc, curr) => {
    return acc + findBiggestNum(curr, 11, curr.length - 12);
  }, 0);
};

// 103593731751018 too low

run({
  part1: {
    tests: [
      {
        input: `
987654321111111
811111111111119
234234234234278
818181911112111
        `,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
987654321111111
811111111111119
234234234234278
818181911112111
        `,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
