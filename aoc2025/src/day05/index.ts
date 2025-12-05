import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const chunks = rawInput.split("\n\n");

  const ranges = chunks[0].split("\n").map((line) => line.split("-").map(r => Number.parseInt(r, 10)));
  const ingredients = chunks[1].split("\n").map(ing => Number.parseInt(ing, 10));

  return { ranges, ingredients };
}

const part1 = (rawInput: string) => {
  const { ranges, ingredients } = parseInput(rawInput);

  return ingredients.reduce((acc, ingredient) => {
    for (const range of ranges) {
      if (range[0] <= ingredient && ingredient <= range[1]) {
        return acc + 1;
      }
    }

    return acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const { ranges } = parseInput(rawInput);
  ranges.sort(function(a, b) { return a[0] - b[0] || a[1] - b[1] });

  const finalRanges: number[][] = [];

  // combine
  for (const range of ranges) {
    let addedToRange = false;

    for (const finalRange of finalRanges) {
      if (range[1] < finalRange[0] || range[0] > finalRange[1]) {
        continue;
      }

      finalRange[0] = Math.min(range[0], finalRange[0]);
      finalRange[1] = Math.max(range[1], finalRange[1]);
      addedToRange = true;
      break;
    }

    if (!addedToRange) {
      finalRanges.push(range);
    }

  }

  // then count
  return finalRanges.reduce((acc, range) => {
    const count = range[1] - range[0] + 1;
    return acc + count;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
