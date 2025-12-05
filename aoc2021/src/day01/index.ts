import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => Number.parseInt(line, 10));

const part1 = (rawInput: string) => {
  const depths = parseInput(rawInput);

  let increases = 0;
  let previousDepth: number | undefined = undefined;
  for (const depth of depths) {
    if (previousDepth !== undefined && previousDepth < depth) {
      increases += 1;
    }
    previousDepth = depth;
  }

  return increases;
};

const part2 = (rawInput: string) => {
  const depths = parseInput(rawInput);

  let increases = 0;
  let previousSum: number | undefined = undefined;
  for (let windowStartIndex = 0; windowStartIndex < depths.length - 2; windowStartIndex++) {
    const sum = depths[windowStartIndex] + depths[windowStartIndex + 1] + depths[windowStartIndex + 2];

    if (previousSum !== undefined && previousSum < sum) {
      increases += 1;
    }
    previousSum = sum;
  }

  return increases;
};

run({
  part1: {
    tests: [
      {
        input: `
199
200
208
210
200
207
240
269
260
263`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
199
200
208
210
200
207
240
269
260
263`,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
