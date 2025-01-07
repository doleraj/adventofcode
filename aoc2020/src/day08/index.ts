import run from "aocrunner";

type Instruction = { opcode: string, argument: number };

const parseInput = (rawInput: string) => rawInput.split("\n").map((line) => {
  const parts = line.split(" ");
  return { opcode: parts[0], argument: Number.parseInt(parts[1]) };
});

const runProgram = (instructions: Instruction[])=> {
  let instructionPointer = 0;
  let accumulator = 0;
  const pastInstructionPointers = new Set<number>();
  while (!pastInstructionPointers.has(instructionPointer) && instructionPointer < instructions.length) {
    pastInstructionPointers.add(instructionPointer);
    const instruction = instructions[instructionPointer];

    if (instruction.opcode === "nop") {
      instructionPointer += 1;
    } else if (instruction.opcode === "acc") {
      accumulator += instruction.argument;
      instructionPointer += 1;
    } else {
      instructionPointer += instruction.argument;
    }
  }

  return { accumulator, finished: instructionPointer === instructions.length };
}

const part1 = (rawInput: string) => {
  const instructions = parseInput(rawInput);

  const { accumulator } = runProgram(instructions);
  return accumulator;
};

const part2 = (rawInput: string) => {
  const instructions = parseInput(rawInput);

  for (let pointer = 0; pointer < instructions.length; pointer++) {
    const newInstructions = instructions.slice();
    const changedInstruction = instructions[pointer];
    if (changedInstruction.opcode === "nop") {
      newInstructions[pointer] = { opcode: "jmp", argument: changedInstruction.argument };
    } else if (changedInstruction.opcode === "jmp") {
      newInstructions[pointer] = { opcode: "nop", argument: changedInstruction.argument };
    }

    const { accumulator, finished } = runProgram(newInstructions);
    if (finished) {
      return accumulator
    }
  }


  return 0;
};

run({
  part1: {
    tests: [
      {
        input: `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`,
        expected: 8,
      },
    ],
    // 2077 too high.
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
