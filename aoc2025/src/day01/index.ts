import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput
  .split(/\n/)
  .map((line) => {
    const chars = line.split("");
    const dir = chars[0];
    const number = Number.parseInt(chars.slice(1).join(""));

    return {dir, number: dir === "L" ? -1 * number : number};
  });

const part1 = (rawInput: string) => {
  const offsets = parseInput(rawInput);
  let dial = 50;
  let zeroCount = 0;

  offsets.forEach(({number}) => {
    dial = (dial + number) % 100;

    if (dial === 0) {
      zeroCount++;
    }
  });

  return zeroCount;
};

const part2 = (rawInput: string) => {
  const offsets = parseInput(rawInput);
  let dial = 50;
  let currentCount = 0;
  let zeroCount = 0;

  offsets.forEach(({dir, number}) => {
    currentCount = number;
    while (currentCount != 0) {
      if (dir === "L") {
        dial = (dial - 1) % 100;
        currentCount++;

        if (dial === 0) {
          zeroCount++;
        }
      } else {
        dial = (dial + 1) % 100;
        currentCount--;

        if (dial === 0) {
          zeroCount++;
        }
      }
    }
  });

  return zeroCount;
};

run({
  part1: {
    tests: [
      {
        input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
