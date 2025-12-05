import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n")
  .map(line => line.split(""));

const part1 = (rawInput: string) => {
  const numbers = parseInput(rawInput);

  const gamma: number[] = [];
  const epsilon: number[] = [];

  for (let i = 0; i < numbers[0].length; i++) {
    let digits = numbers.reduce((acc, cur) => {
      acc.push(cur[i]);
      return acc;
    }, []);

    const grouped = digits.groupBy(d => d);
    gamma.push(grouped['0'].length > grouped['1'].length ? 0 : 1);
    epsilon.push(grouped['0'].length > grouped['1'].length ? 1 : 0);
  }

  return Number.parseInt(gamma.join(""), 2) * Number.parseInt(epsilon.join(""), 2);
};

const part2 = (rawInput: string) => {
  const numbers = parseInput(rawInput);

  let oxyGen: string[] = [];
  let validOxyGenNumbers = numbers.slice(0);
  for (let i = 0; i < numbers[0].length; i++) {
    let digits = validOxyGenNumbers.reduce((acc, cur) => {
      acc.push(cur[i]);
      return acc;
    }, []);

    const grouped = digits.groupBy(d => d);
    const mostCommon = grouped['0'].length === grouped['1'].length ? '1' : grouped['0'].length > grouped['1'].length ? '0' : '1';
    validOxyGenNumbers = validOxyGenNumbers.filter(n => n[i] === mostCommon);

    if (validOxyGenNumbers.length === 1) {
      oxyGen = validOxyGenNumbers[0];
      break;
    }
  }

  let co2Scrubber: string[] = [];


  let validCo2ScrubberNumbers = numbers.slice(0);
  for (let i = 0; i < numbers[0].length; i++) {
    let digits = validCo2ScrubberNumbers.reduce((acc, cur) => {
      acc.push(cur[i]);
      return acc;
    }, []);

    const grouped = digits.groupBy(d => d);
    const leastCommon = grouped['0'].length === grouped['1'].length ? '0' : grouped['0'].length > grouped['1'].length ? '1' : '0';
    validCo2ScrubberNumbers = validCo2ScrubberNumbers.filter(n => n[i] === leastCommon);

    if (validCo2ScrubberNumbers.length === 1) {
      co2Scrubber = validCo2ScrubberNumbers[0];
      break;
    }
  }

  return Number.parseInt(oxyGen.join(""), 2) * Number.parseInt(co2Scrubber.join(""), 2);
};

run({
  part1: {
    tests: [
      {
        input: `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
        expected: 230,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
