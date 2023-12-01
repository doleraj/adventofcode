import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.split('\n').map(line => {
    let leftNum: string = "";
    let rightNum: string = "";
    for (let i = 0; i < line.length; i++) {
      const left = line[i];
      if (!leftNum && left && Number.parseInt(left)) {
        leftNum = left;
      }
      const right = line[line.length - 1 - i];
      if (!rightNum && right && Number.parseInt(right)) {
        rightNum = right;
      }
    }

    return Number.parseInt(leftNum + rightNum);
  }).reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  });
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split('\n');

  return lines.map(line => {
    // Welp time to do this the Dumb Way :tm:
    const checkArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const actualNumbersArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let bestLeftIndex = -1;
    let leftmostNumber = "";
    checkArray.map((checkNum, index) => {
      const newIndex = line.indexOf(checkNum);
      // console.log(`Checking ${checkNum} against ${line}, found it at ${newIndex}`);
      if (newIndex !== -1 && (bestLeftIndex === -1 || newIndex < bestLeftIndex)) {
        // console.log(`Setting best index to ${newIndex}`);
        bestLeftIndex = newIndex;
        leftmostNumber = actualNumbersArray[index];
      }
    });

    let bestRightIndex = -1;
    let rightmostNumber = "";
    checkArray.map((checkNum, index) => {
      const newIndex = line.lastIndexOf(checkNum);
      // console.log(`Checking ${checkNum} against ${line}, found it at ${newIndex}`);
      if (newIndex !== -1 && (bestRightIndex === -1 || newIndex > bestRightIndex)) {
        // console.log(`Setting best index to ${newIndex}`);
        bestRightIndex = newIndex;
        rightmostNumber = actualNumbersArray[index];
      }
    });

    return Number.parseInt(leftmostNumber + rightmostNumber);
  }).reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  });
};

run({
  part1: {
    tests: [
      {
        input: `1abc2`,
        expected: 12,
      },
      {
        input: `pqr3stu8vwx`,
        expected: 38,
      },
      {
        input: `a1b2c3d4e5f`,
        expected: 15,
      },
      {
        input: `treb7uchet`,
        expected: 77,
      },
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine`,
        expected: 29,
      },
      {
        input: `eightwothree`,
        expected: 83,
      },
      {
        input: `abcone2threexyz`,
        expected: 13,
      },
      {
        input: `xtwone3four`,
        expected: 24,
      },
      {
        input: `4nineeightseven2`,
        expected: 42,
      },
      {
        input: `zoneight234`,
        expected: 14,
      },
      {
        input: `7pqrstsixteen`,
        expected: 76,
      },
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
