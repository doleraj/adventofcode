import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n")
  .map(line => {
    const matches = [...line.matchAll(/\s*(\d+|\*|\+)\s*/g)];
    return matches.map(m => m[1]);
  });

const part1 = (rawInput: string) => {
  const parts = parseInput(rawInput);
  const operators = parts.pop()!!;
  const numbers = parts.map(line => {
      return line.map(n => Number.parseInt(n));
  });

  let sum = 0;
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "+") {
      sum += numbers.reduce((acc, n) => acc + n[i], 0);
    } else {
      sum += numbers.reduce((acc, n) => acc * n[i], 1);
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const parts = rawInput.split("\n").map(line => line.split(""));
  const operators = parts.pop()!!;

  const matrices = [];
  let currents: string[][] = parts.map(_ => []);
  let currentOperator = '';
  for (let i = 0; i < operators.length; i++) {
    if (parts.every((line) => line[i] === " ")) {

      matrices.push({ op: currentOperator, matrix: currents.slice() });
      currents = parts.map((_) => []);
      currentOperator = "";
    } else {
      for (let j = 0; j < parts.length; j++) {
        currents[j].push(parts[j][i]);
      }
      if (currentOperator === "" && operators[i] !== " ") {
        currentOperator = operators[i];
      }
    }
  }
  matrices.push({ op: currentOperator, matrix: currents.slice() });

  let sum = 0;
  for (const { matrix, op } of matrices) {
    const rotated = matrix[0].map((val, index) => matrix.map(row => row[index]))
    const numbers = rotated.map(line => Number.parseInt(line.join("").trim())).filter(n => !Number.isNaN(n));

    if (op === "+") {
      sum += numbers.reduce((acc, n) => acc + n, 0);
    } else {
      sum += numbers.reduce((acc, n) => acc * n, 1);
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
