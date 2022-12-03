import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

let val = 1
const alphabet: string = "abcdefghijklmnopqrstuvwxyz";
const valueMap = (alphabet + alphabet.toUpperCase()).split("").reduce((accum, currentValue) => {
  accum[currentValue] = val++;
  return accum;
}, {} as Record<string, number>)

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const repeatedChars = input.split("\n").map(line => {
    const middle = Math.floor(line.length / 2);
    const halves = [line.substring(0, middle), line.substring(middle)];
    // console.log(halves);
    return halves[0].split("").reduce((previousValue, currentValue) => {
      // console.log(`${previousValue} - ${currentValue}`)
      if (previousValue) {
        return previousValue;
      }

      if (halves[1].includes(currentValue)) {
        // console.log(`Found repeat: ${currentValue}`)
        return currentValue;
      } else {
        return "";
      }
    }, "");
  });
  // console.log(repeatedChars);

  return repeatedChars.reduce((accum, currentValue) => {
    console.log(`${currentValue} - ${valueMap[currentValue]}`);
    return accum + valueMap[currentValue];
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const elves = input.split("\n");

  return elves.map((value, i, array) => {
    if (i % 3 !== 0) {
      return null;
    }

    return value.split("").reduce((previousValue, currentValue) => {
      if (previousValue) {
        return previousValue;
      }

      if (array[i + 1].includes(currentValue) && array[i + 2].includes(currentValue)) {
        // console.log(`Found repeat: ${currentValue}`)
        return currentValue;
      } else {
        return "";
      }
    }, "")
  })
    .filter((value): value is string => value !== null)
    .reduce((accum, currentValue) => {
      console.log(`${currentValue} - ${valueMap[currentValue]}`);
      return accum + valueMap[currentValue];
    }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
