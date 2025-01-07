import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const regexp = /(\d+)-(\d+) (\w)/;
  return rawInput.split("\n").map(line => {
    const parts = line.split(": ");
    const policy = parts[0].match(regexp)!!;
    return { char: policy[3], lowerLimit: Number.parseInt(policy[1]), upperLimit: Number.parseInt(policy[2]), password: parts[1] };
  });
}

const part1 = (rawInput: string) => {
  const entries = parseInput(rawInput);

  return entries.reduce((acc, curr) => {
    const count = Array.from(curr.password.matchAll(new RegExp(curr.char, "g"))).length;

    if (count >= curr.lowerLimit && count <= curr.upperLimit) {
      acc += 1;
    }

    return acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const entries = parseInput(rawInput);

  return entries.reduce((acc, curr) => {

    if (curr.password[curr.lowerLimit - 1] === curr.char && curr.password[curr.upperLimit - 1] !== curr.char) {
      acc += 1;
    } else if (curr.password[curr.lowerLimit - 1] !== curr.char && curr.password[curr.upperLimit - 1] === curr.char) {
      acc += 1;
    }

    return acc;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
