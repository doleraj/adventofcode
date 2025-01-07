import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map(l => Number.parseInt(l));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const preamble = input.length < 21 ? 5 : 25;

  let previousNumbers = input.slice(0, preamble);
  for (let number of input.slice(preamble)) {
    let valid = false;
    for (let firstNumber of previousNumbers) {
      for (let secondNumber of previousNumbers) {
        if (firstNumber != secondNumber) {
          valid = valid || number === firstNumber + secondNumber;
        }
      }
    }

    if (!valid) {
      return number;
    }

    previousNumbers = previousNumbers.slice(1);
    previousNumbers.push(number);
  }

  return -1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const invalidNumber = input.length < 21 ? 127 : 15690279;

  for (let i = 0; i < input.length; i++) {
    // console.log(`Checking with start at ${i}`)
    let sum = input[i];
    let j = i + 1;
    while (sum < invalidNumber && j < input.length) {
      sum += input[j++];

      if (sum === invalidNumber) {
        const range = input.slice(i, j);
        return Math.min(...range) + Math.max(...range);
      }
    }
  }

  return -1;
};

run({
  part1: {
    tests: [
      {
        input: `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`,
        expected: 127,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`,
        expected: 62,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
