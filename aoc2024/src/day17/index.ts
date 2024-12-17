import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");

  const [aInit, bInit, cInit] = parts[0].split("\n").map(line => BigInt(line.split(": ")[1]));
  const opCodesAndOperands = parts[1].split(": ")[1].split(",").map(t => Number.parseInt(t));
  return { aInit, bInit, cInit, opCodesAndOperands };
}

const decodeComboOperand = (operand: number, a: bigint, b: bigint, c: bigint): bigint => {
  if (operand <= 3) {
    return BigInt(operand);
  } else if (operand === 4) {
    return a;
  } else if (operand === 5) {
    return b;
  } else if (operand === 6) {
    return c;
  }
  return -1n;
}

function runPart1(opCodesAndOperands: number[], a: bigint, b: bigint, c: bigint ) {
  let instructionPointer = 0;
  let output: bigint[] = [];

  while (instructionPointer < opCodesAndOperands.length) {
    const operator = opCodesAndOperands[instructionPointer];
    const operand = opCodesAndOperands[instructionPointer + 1];

    if (operator === 0) {
      // adv
      a = a / 2n ** decodeComboOperand(operand, a, b, c);
    } else if (operator === 1) {
      // bxl
      b = b ^ BigInt(operand);
    } else if (operator === 2) {
      // bst
      b = decodeComboOperand(operand, a, b, c) % 8n;
    } else if (operator === 3) {
      // jnz
      if (a !== 0n) {
        instructionPointer = operand - 2;
      }
      // return output;
    } else if (operator === 4) {
      // bxc
      b = b ^ c;
    } else if (operator === 5) {
      // out
      output.push(decodeComboOperand(operand, a, b, c) % 8n);
    } else if (operator === 6) {
      // bdv
      b = a / 2n ** decodeComboOperand(operand, a, b, c);
    } else {
      // cdv
      c = a / 2n ** decodeComboOperand(operand, a, b, c);
    }
    instructionPointer += 2;
  }

  return output.join(",");
}

const part1 = (rawInput: string) => {
  const { aInit, bInit, cInit, opCodesAndOperands } = parseInput(rawInput);
  return runPart1(opCodesAndOperands, aInit, bInit, cInit);
};

const part2 = (rawInput: string) => {
  const { bInit, cInit, opCodesAndOperands } = parseInput(rawInput);

  const quineput = opCodesAndOperands.join("");
  let aInits = [0n];

  for (let i = 1; i <= quineput.length; i++) {
    const currentQuineputWindow = quineput.slice(-1 * i).split("").join(",");
    // console.log(`Current quineput window: ${currentQuineputWindow}`);
    let output = "";
    const nextAInits = [];
    for (let aInit of aInits) {
      // console.log(`Starting hunt for position ${i} with starter ${aInit}`);

      for (let count = 0; count < 9; count++) {
        output = runPart1(opCodesAndOperands, aInit, bInit, cInit);
        // console.log(`aInit is ${aInit}, output is ${output}`);

        if (currentQuineputWindow === output) {
          // console.log(`Found an A at ${aInit}`);
          if (i < quineput.length) {
            // console.log(`Pushing new aInit ${aInit}`);
            nextAInits.push(aInit << 3n);
          } else {
            // console.log(`Pushing new aInit ${aInit}`);
            nextAInits.push(aInit);
          }
        }
        aInit++
      }
    }

    aInits = nextAInits;
  }
  // console.log(aInits);

  const answerStr = aInits[0].toString();
  return answerStr.substring(0, answerStr.length)
};

run({
  part1: {
    tests: [
      {
        input: `
Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4`,
        expected: "0,1,2",
      },
      {
        input: `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: "4,2,5,6,7,7,7,7,3,1,0",
      },
      {
        input: `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
      {
        input: `
Register A: 117440
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
        expected: "0,3,5,4,3,0",
      },
      {
        input: `
Register A: 756400856
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,1,5,4,2,5,5,0,3,3,0`,
        expected: "0,3,5,4,3,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
        expected: '117440',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
