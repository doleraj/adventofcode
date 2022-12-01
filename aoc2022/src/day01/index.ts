import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const counts = input.split("\n");

  var elfIndex = 0;
  const elfCalorieTotals = counts.reduce((resultArray,  currentValue) => {
    if (currentValue === '') {
      elfIndex++;
      return resultArray;
    }

    if (!resultArray[elfIndex]) {
      resultArray[elfIndex] = 0;
    }
    resultArray[elfIndex] += Number.parseInt(currentValue, 10);

    return resultArray;
  }, [] as number[]);
  return Math.max(...elfCalorieTotals);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const counts = input.split("\n");

  var elfIndex = 0;
  const elfCalorieTotals = counts.reduce((resultArray,  currentValue) => {
    if (currentValue === '') {
      elfIndex++;
      return resultArray;
    }

    if (!resultArray[elfIndex]) {
      resultArray[elfIndex] = 0;
    }
    resultArray[elfIndex] += Number.parseInt(currentValue, 10);

    return resultArray;
  }, [] as number[]);


  elfCalorieTotals.sort((a, b) => b - a);
  return elfCalorieTotals[0] + elfCalorieTotals[1] + elfCalorieTotals[2];
};

run({
  part1: {
    tests: [
      {
        input: `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
