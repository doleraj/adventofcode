import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map(l => Number.parseInt(l));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let i = 1; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (input[i] + input[j] === 2020) {
        return input[i] * input[j];
      }
    }
  }

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let i = 1; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      for (let k = 0; k < input.length; k++) {
        if (input[i] + input[j] + input[k] === 2020) {
          return input[i] * input[j] * input[k];
        }
      }
    }
  }

  return;
};

run({
  part1: {
    tests: [
      {
        input: `1721
979
366
299
675
1456`,
        expected: 514579,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1721
979
366
299
675
1456`,
        expected: 241861950,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
