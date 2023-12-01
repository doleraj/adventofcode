import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // each line contains a calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.
  // part 1: What is the sum of all of the calibration values for the devices in your notes?

  // Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".
  // part 2: Equipped with this new information, you now need to find the real first and last digit on each line. For example:

  return input.split("\n").map((line) => {
    const firstDigit = line.match(/\d/)?.[0];
    const lastDigit = line.match(/\d(?=\D*$)/)?.[0];
    return firstDigit && lastDigit ? parseInt(firstDigit + lastDigit) : 0;
  }).reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const firstNumber = line.match(/(one|two|three|four|five|six|seven|eight|nine|\d)/i)?.[0] ?? '';
    const parsedFirstNumber = isNaN(Number(firstNumber)) ? convertWordToDigit(firstNumber) : Number(firstNumber);

    const lastNumber = Array.from(line.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/gi), (match) => match[1])?.pop() ?? '';
    // console.log(line.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/ig));
    const parsedLastNumber = isNaN(Number(lastNumber)) ? convertWordToDigit(lastNumber) : Number(lastNumber);

    return Number.parseInt(parsedFirstNumber.toString() + parsedLastNumber.toString());
  }).reduce((acc, curr) => {
    const foo = acc + curr;
    // console.log(`After adding ${curr}, the total is ${foo}`)
    return foo;
  }, 0);

  function convertWordToDigit(word: string): number {
    switch (word.toLowerCase()) {
      case "one":
        return 1;
      case "two":
        return 2;
      case "three":
        return 3;
      case "four":
        return 4;
      case "five":
        return 5;
      case "six":
        return 6;
      case "seven":
        return 7;
      case "eight":
        return 8;
      case "nine":
        return 9;
      default:
        return 0;
    }
  }
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
      {
        input: `seventjxr91sevenseveneightwojf`,
        expected: 72,   
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
