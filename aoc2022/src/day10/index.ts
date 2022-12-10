import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const incrementAndCheckCycle = (initialCycle: number, signalStrengths: number[], registers: number[]): number => {
  const nextCycle = initialCycle + 1;
  if ((nextCycle - 20) % 40 === 0) {
    signalStrengths.push(registers[0]);
  }
  // console.log(`cycle: ${nextCycle} - registers: ${registers}`);
  return nextCycle;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const registers = [1];
  const signalStrengths: number[] = [];
  let cycle = 1;

  input.split("\n").forEach(operation => {
    const match = operation.match(/addx (-?\d+)/);
    if (match !== null) {
      const val = Number(match!![1]);
      cycle = incrementAndCheckCycle(cycle, signalStrengths, registers);
      registers[0] += val;
    }

    cycle = incrementAndCheckCycle(cycle, signalStrengths, registers);
  })

  return signalStrengths
    .map((strength, index) => ((40 * index) + 20) * strength)
    .reduce((accum, value) => accum + value, 0);
};

const incrementAndDraw = (initialCycle: number, crtOutput: string[], registers: number[]): number => {
  const nextCycle = initialCycle + 1;
  const crtCursorPos = (nextCycle - 1) % 40;
  // console.log(`cycle: ${nextCycle} - crtCursorPos: ${crtCursorPos} - x: ${registers[0]}`);
  if (initialCycle > 1 && crtCursorPos === 0) {
    crtOutput.push("\n");
  }
  if (crtCursorPos === registers[0] - 1 || crtCursorPos === registers[0] || crtCursorPos === registers[0] + 1) {
    crtOutput.push("#");
  } else {
    crtOutput.push(".");
  }
  // console.log(`cycle: ${nextCycle} - registers: ${registers}`);
  return nextCycle;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const registers = [1];
  const crtOutput: string[] = [];
  let cycle = 0;

  cycle = incrementAndDraw(cycle, crtOutput, registers);
  input.split("\n").forEach(operation => {
    const match = operation.match(/addx (-?\d+)/);
    if (match !== null) {
      const val = Number(match!![1]);
      cycle = incrementAndDraw(cycle, crtOutput, registers);
      registers[0] += val;
    }

    cycle = incrementAndDraw(cycle, crtOutput, registers);
  })

  return crtOutput.join("");
};

run({
  part1: {
    tests: [
      {
        input: `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: "##..##..##..##..##..##..##..##..##..##..\n" +
          "###...###...###...###...###...###...###.\n" +
          "####....####....####....####....####....\n" +
          "#####.....#####.....#####.....#####.....\n" +
          "######......######......######......####\n" +
          "#######.......#######.......#######.....\n" +
          "."
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
