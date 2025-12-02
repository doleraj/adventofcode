import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput
  .split(",")
  .map((line) => line.split("-").map(n => Number.parseInt(n)));

const isFakeId1 = (input: number) => {
  const digits = input.toString().split("");
  const frontHalf = digits.slice(0, digits.length / 2).join("");
  const backHalf = digits.slice(digits.length / 2).join("");

  return frontHalf === backHalf;
}

const part1 = (rawInput: string) => {
  const ranges = parseInput(rawInput);

  return ranges.reduce((acc, range) => {
    let currentId = range[0];
    let localSum = 0;

    while (currentId <= range[1]) {
      if (isFakeId1(currentId)) {
        localSum += currentId;
      }
      currentId++;
    }

    return localSum + acc
  }, 0);
};

const isFakeId2 = (input: number) => {
  const digits = input.toString();
  // Can't have repeats if it's just one number *taps temple twice*
  if (digits.length === 1) {
    return false;
  }

  let patternLength = 0;

  while (patternLength < (digits.length / 2)) {
    patternLength++;

    // If it doesn't divide evenly it can't be an invalid id pattern
    if (digits.length % patternLength !== 0) {
      continue;
    }

    const chunks: string[] = [];
    for (let i = 0; i < digits.length; i += patternLength) {
      chunks.push(digits.substring(i, i + patternLength));
    }

    if (chunks.reduce((acc, curr) => {
      return acc && curr === chunks[0];
    }, true)) {
      return true;
    }
  }

  return false;
}

const part2 = (rawInput: string) => {
  const ranges = parseInput(rawInput);

  return ranges.reduce((acc, range) => {
    let currentId = range[0];
    let localSum = 0;

    while (currentId <= range[1]) {
      if (isFakeId2(currentId)) {
        localSum += currentId;
      }
      currentId++;
    }

    return localSum + acc
  }, 0);
};

// 31578210067 too high

run({
  part1: {
    tests: [
      {
        input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
