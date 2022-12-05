import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const parseCrates = (rawCrateData:string): string[][] => {
  const stackIndeces = [] as number[];
  return rawCrateData.split("\n").reverse().reduce(((accum, currentValue, rowIndex) => {
    if (rowIndex === 0) {
      currentValue.split("").forEach((value, index) => {
        if (Number(value)) {
          stackIndeces.push(index);
          accum.push([]);
        }
      });

    } else {
      currentValue.split("").forEach((value, index) => {
        const stackIndex = stackIndeces.indexOf(index);
        if (stackIndex >= 0 && value !== " ") {
          accum[stackIndex].push(value);
        }
      })
    }
    return accum;
  }), [] as string[][]);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const parts = input.split("\n\n");
  const crates = parseCrates(parts[0]);

  parts[1].split("\n").map(moveString => {
    const match = moveString.match(/move (\d+) from (\d+) to (\d+)/);
    if (match) {
      return { moves: Number(match[1]), firstStack: Number(match[2]), secondStack: Number(match[3])};
    }
  }).filter(move => move !== undefined).forEach(move => {
    const firstStack = crates[move!.firstStack - 1];
    const secondStack = crates[move!.secondStack - 1];

    const moved = firstStack.splice(Math.max(0, firstStack.length - move!.moves), move!.moves);
    secondStack.push(...moved.reverse());
  })
  // console.log(crates)
  return crates.map(crate => crate[crate.length - 1]).join("");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const parts = input.split("\n\n");
  const crates = parseCrates(parts[0]);

  parts[1].split("\n").map(moveString => {
    const match = moveString.match(/move (\d+) from (\d+) to (\d+)/);
    if (match) {
      return { moves: Number(match[1]), firstStack: Number(match[2]), secondStack: Number(match[3])};
    }
  }).filter(move => move !== undefined).forEach(move => {
    const firstStack = crates[move!.firstStack - 1];
    const secondStack = crates[move!.secondStack - 1];

    const moved = firstStack.splice(Math.max(0, firstStack.length - move!.moves), move!.moves);
    secondStack.push(...moved);
  })
  console.log(crates)
  return crates.map(crate => crate[crate.length - 1]).join("");
};

run({
  part1: {
    tests: [
      {
        input: `    
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2,
`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
