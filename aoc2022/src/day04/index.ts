import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n")
    .map(line => line.split(","))
    .map(parts => {
      return parts.map(range => range.split("-").map(endpoint => Number.parseInt(endpoint, 10)))
    })
    .map(rangePairs => {
      const firstRange = rangePairs[0];
      const secondRange = rangePairs[1];
      const firstContainsSecond = firstRange[0] <= secondRange[0] && secondRange[1] <= firstRange[1];
      const secondContainsFirst = secondRange[0] <= firstRange[0] && firstRange[1] <= secondRange[1];
      return firstContainsSecond || secondContainsFirst;
    })
    .filter(rangeCheck => rangeCheck)
    .length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n")
    .map(line => line.split(","))
    .map(parts => {
      return parts.map(range => range.split("-").map(endpoint => Number.parseInt(endpoint, 10)))
    })
    .map(rangePairs => {
      const firstRange = rangePairs[0];
      const secondRange = rangePairs[1];

      const firstIntersectsSecond = (secondRange[0] <= firstRange[0] && firstRange[0] <= secondRange[1])
        || (secondRange[0] <= firstRange[1] && firstRange[1] <= secondRange[1])
      const secondIntersectsFirst = (firstRange[0] <= secondRange[0] && secondRange[0] <= firstRange[1])
        || (firstRange[0] <= secondRange[1] && secondRange[1] <= firstRange[1])
      return firstIntersectsSecond || secondIntersectsFirst;
    })
    .filter(rangeCheck => rangeCheck)
    .length;
};

run({
  part1: {
    tests: [
      {
        input: `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
