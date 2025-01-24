import run from "aocrunner";

type Operation = { left: bigint | Operation, right: bigint | Operation, op: string };

const parseInput = (rawInput: string) => rawInput.split("\n");

const evalOp = (op: Operation): bigint => {
  let leftVal: bigint;
  if (typeof op.left !== "bigint") {
    leftVal = evalOp(op.left);
  } else {
    leftVal = op.left;
  }

  let rightVal: bigint;
  if (typeof op.right !== "bigint") {
    rightVal = evalOp(op.right);
  } else {
    rightVal = op.right;
  }

  let result = -1n;
  if (op.op === "+") {
    result = leftVal + rightVal;
  } else {
    result = leftVal * rightVal;
  }

  // console.log(`Evaluating operation: %o - result %o`, op, result);
  return result;
};

const parseOp = (leftParam: Operation | string, pointer: number, parts: string[]): [Operation, number, string] => {
  let left: bigint | Operation;
  let pointerMod = 0;

  if (typeof leftParam === "string") {
    if (!leftParam.startsWith("(")) {
      left = BigInt(leftParam);
    } else {
      // console.log(`Starting paren expression on the left at ${leftParam}`);
      const [result, subPointerMod] = parseOp(leftParam.substring(1), pointer, parts);
      left = result;
      // console.log(left);
      pointerMod += subPointerMod;
    }
  } else {
    left = leftParam as Operation;
  }

  let op = parts[pointer + ++pointerMod];
  let rightStr = parts[pointer + ++pointerMod];
  // console.log(op, rightStr);

  while (rightStr && !rightStr.endsWith(")")) {
    let right: Operation | bigint;
    if (rightStr.startsWith("(")) {
      // console.log(`Starting paren expression on the right at ${rightStr}`);
      const [result, subPointerMod, leftovers] = parseOp(rightStr.substring(1), pointer + pointerMod, parts);
      right = result;
      // console.log("Result of paren expression: %o", result)
      pointerMod += subPointerMod;
      // remainingString = leftovers;
      if (leftovers.endsWith(")")) {
        return [{ left, right, op }, pointerMod, leftovers.substring(1)];
      }
    } else {
      right = BigInt(rightStr);
    }

    left = { left, right, op };
    // console.log(`Finalizing new left as %o`, left)
    op = parts[pointer + ++pointerMod];
    rightStr = parts[pointer + ++pointerMod];
  }

  if (!rightStr) {
    return [left as Operation, pointerMod, ""];
  } else {
    // console.log("Paren closing. left: %o, right: %o", left, rightStr);
    const right = BigInt(rightStr.replaceAll(")", ""));
    return [{ left, right, op }, pointerMod, rightStr.substring(2)];
  }
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  return lines.reduce((sum, line) => {
    const parts = line.split(" ");

    const leftStr = parts[0];
    let current: Operation = { left: 0n, right: 0n, op: "+" }
    let pointer = 0;

    while (pointer < parts.length) {
      const [next, pointerMod] = parseOp(leftStr, pointer, parts);
      current = next;
      pointer += pointerMod;
    }

    return sum + evalOp(current);
  }, 0n).toString();
};

const evaluateOp = (leftParam: bigint | string, parts: string[]): [bigint, string] => {
  let left;
  if (typeof leftParam === "string") {
    if (leftParam.startsWith("(")) {
      const [result] = evaluateOp(leftParam.substring(1), parts);
      left = result;
    } else {
      left = BigInt(leftParam);
    }
  } else {
    left = leftParam;
  }

  const stack = [left];
  let remainingString = "";

  while (parts.length > 0 && remainingString.length === 0) {
    const operator = parts.pop()!!;
    const rightStr = parts.pop()!!;

    let right: bigint;
    if (rightStr.startsWith("(")) {
      const [result, remainder] = evaluateOp(rightStr.substring(1), parts);
      right = result;
      remainingString = remainder;
    } else if (rightStr.endsWith(")")) {
      right = BigInt(rightStr.replaceAll(")", ""));
      remainingString = rightStr.substring(2);
    } else {
      right = BigInt(rightStr);
    }

    if (operator === "+") {
      stack.push(stack.pop()!! + right);
    } else {
      stack.push(right);
    }

    if (rightStr.endsWith(")")) {

      break;
    }
    else if (remainingString.length > 0) {
      remainingString = remainingString.substring(1);
      break;
    }
  }
  return [stack.reduce((mult, num) => mult * num, 1n), remainingString];
}

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  return lines.reduce((sum, line) => {
    const parts = line.split(" ").reverse();
    return sum + evaluateOp(parts.pop()!!, parts)[0];
  }, 0n).toString();
};

run({
  part1: {
    tests: [
      {
        input: `1 + 2 * 3 + 4 * 5 + 6`,
        expected: "71",
      },
      {
        input: `1 + (2 * 3) + (4 * (5 + 6))`,
        expected: "51",
      },
      {
        input: `2 * 3 + (4 * 5)`,
        expected: "26",
      },
      {
        input: `5 + (8 * 3 + 9 + 3 * 4 * 3)`,
        expected: "437",
      },
      {
        input: `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`,
        expected: "12240",
      },
      {
        input: `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`,
        expected: "13632",
      },
      {
        input: `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2\n5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`,
        expected: "25872",
      },
      {
        input: `1 + 2 * 3 + 4 * 5 + 6\n1 + (2 * 3) + (4 * (5 + 6))\n2 * 3 + (4 * 5)\n5 + (8 * 3 + 9 + 3 * 4 * 3)\n5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))\n((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`,
        expected: "26457",
      },
      {
        input: `4 * ((4 + 9 + 3 * 3 * 5) * 3 + 2 + 2 * (9 * 2 + 3)) + 5`,
        expected: "60821",
      },
      {
        input: `4 * ((4 + 9 + 3 * 3 * 5) * 3 + 2 + 2 * (9 * 2 + 3)) + 5 * ((8 * 3 * 6) + 9 * 4 + (5 + 4 * 7 + 7)) * 7 * (9 + 2 * 2)`,
        expected: "6387907988",
      },
    ],
    // 373104 too low
    // 98721031659607 too high
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1 + 2 * 3 + 4 * 5 + 6`,
        expected: "231",
      },
      {
        input: `1 + (2 * 3) + (4 * (5 + 6))`,
        expected: "51",
      },
      {
        input: `2 * 3 + (4 * 5)`,
        expected: "46",
      },
      {
        input: `5 + (8 * 3 + 9 + 3 * 4 * 3)`,
        expected: "1445",
      },
      {
        input: `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`,
        expected: "669060",
      },
      {
        input: `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`,
        expected: "23340",
      },
      {
        input: `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) * 2`,
        expected: "1338120",
      },
      {
        input: `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) + 1`,
        expected: "669105",
      },
    ],
    // 241480613731755 too high
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
