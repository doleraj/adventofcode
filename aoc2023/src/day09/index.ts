import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => {
    return line.split(" ").map(num => Number.parseInt(num))
  });
}

const generateDeltaSequence = (sequence: number[]) => {
  const next = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    next.push(sequence[i + 1] - sequence[i]);
  }
  return next;
}

const sumSequence = (sequence: number[]) => {
  return sequence.reduce((accum, next) => accum + next, 0);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sequenceNexts = input.map(sequence => {
    const deltaSeqs = [sequence];
    while (sumSequence(deltaSeqs[deltaSeqs.length - 1]) !== 0) {
      deltaSeqs.push(generateDeltaSequence(deltaSeqs[deltaSeqs.length - 1]));
    }

    return deltaSeqs.reduce((accum, curr) => {
      return accum + curr[curr.length - 1];
    }, 0);
  });

  return sequenceNexts.reduce((accum, curr) => accum + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sequenceNexts = input.map(sequence => {
    const deltaSeqs = [sequence];
    while (sumSequence(deltaSeqs[deltaSeqs.length - 1]) !== 0) {
      deltaSeqs.push(generateDeltaSequence(deltaSeqs[deltaSeqs.length - 1]));
    }
    deltaSeqs.reverse();

    return deltaSeqs.reduce((accum, curr, index) => {
      if (index !== 0) {
        accum = curr[0] - accum;
      }
      return accum;
    }, 0);
  });

  return sequenceNexts.reduce((accum, curr) => accum + curr, 0);
};


run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15`,
        expected: 18
      },
      {
        input: `1 3 6 10 15 21`,
        expected: 28,
      },
      {
        input: `10 13 16 21 30 45`,
        expected: 68,
      },
      {
        input: `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15`,
        expected: -3
      },
      {
        input: `1 3 6 10 15 21`,
        expected: 0,
      },
      {
        input: `10 13 16 21 30 45`,
        expected: 5,
      },
      {
        input: `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
