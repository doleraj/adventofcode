import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const matches = [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)];
  return matches.reduce((result, match) => {
    const mult = Number.parseInt(match[1], 10) * Number.parseInt(match[2], 10);

    return result + mult;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const matches = [...input.matchAll(/(do\(\))|(don't\(\))|mul\((\d{1,3}),(\d{1,3})\)/g)];
  const final = matches.reduce((result, match) => {
    if (match[1] == 'do()') {
      result.do = true;
      return result;
    } else if (match[2] =='don\'t()') {
      result.do = false;
      return result;
    }

    const mult = Number.parseInt(match[3], 10) * Number.parseInt(match[4], 10);

    if (result.do) {
      result.result = result.result + mult;
    }

    return result;
  }, { result: 0, do: true });

  return final.result;
};

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
