import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    const parts = line.trim().split(":");
    return { result: parseInt(parts[0], 10), values: parts[1].trim().split(" ").map(num => parseInt(num, 10)) };
  });
}

const processValue = (index: number, previousResults: number[], values: number[]): number[] => {
  const currentValue = values[index];

  let nextValues: number[];
  if (previousResults.length === 0) {
    nextValues = [ currentValue ];
  } else {
    nextValues = previousResults.map(prevResult => [ prevResult + currentValue, prevResult * currentValue ]).flat();
  }

  if (index == values.length - 1) {
    return nextValues;
  } else {
    return processValue(index + 1, nextValues, values);
  }
}

const part1 = (rawInput: string) => {
  const equations = parseInput(rawInput);

  return equations.reduce((calibrationResult, { result, values }) => {

    const possibleResults = processValue(0, [], values);
    return calibrationResult + (possibleResults.includes(result) ? result : 0);
  }, 0);
};

const processValue2 = (index: number, previousResults: number[], values: number[]): number[] => {
  const currentValue = values[index];

  let nextValues: number[];
  if (previousResults.length === 0) {
    nextValues = [ currentValue ];
  } else {
    nextValues = previousResults.map(prevResult => [
      prevResult + currentValue,
      prevResult * currentValue,
      parseInt(prevResult.toString() + currentValue.toString(), 10)
    ]).flat();
  }

  for (let val of nextValues) {
    if (!Number.isSafeInteger(val)) {
      throw new Error(`We're gonna need a bigger boat: ${val}`);
    }
  }

  if (index == values.length - 1) {
    return nextValues;
  } else {
    return processValue2(index + 1, nextValues, values);
  }
}

const part2 = (rawInput: string) => {
  const equations = parseInput(rawInput);

  return equations.reduce((calibrationResult, { result, values }) => {

    const possibleResults = processValue2(0, [], values);
    return calibrationResult + (possibleResults.includes(result) ? result : 0);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
