import run from "aocrunner";
import { chineseRemainderTheorem, doActualModNotFakeAlmostCorrectMod, lcmArray } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n");
  const earliest = Number.parseInt(parts[0]);
  const busArray = parts[1].split(",").map(busId => {
    if (busId === "x") {
      return -1;
    } else {
      return Number.parseInt(busId);
    }
  });
  return { earliest, busArray };
}

const part1 = (rawInput: string) => {
  const { earliest, busArray } = parseInput(rawInput);
  const validBuses = busArray.filter(busId => busId !== -1);

  let currentTime = earliest;
  while (currentTime < Number.MAX_SAFE_INTEGER) {
    for (let bus of validBuses) {
      if (currentTime % bus === 0) {
        return bus * (currentTime - earliest);
      }
    }
    currentTime++;
  }

  return;
};

const part2 = (rawInput: string) => {
  const { busArray } = parseInput(rawInput);

  const { moduli, remainders } = busArray.reduce(({ moduli, remainders }, bus, index) => {
    if (bus != -1) {
      const modulus = BigInt(bus)
      moduli.push(modulus);
      remainders.push((modulus - BigInt(index)) % modulus);
    }

    return { moduli, remainders };
  }, { moduli: [] as bigint[], remainders: [] as bigint[] });

  return chineseRemainderTheorem(moduli, remainders).toString();
};

run({
  part1: {
    tests: [
      {
        input: `939
7,13,x,x,59,x,31,19`,
        expected: 295,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `939
7,13,x,x,59,x,31,19`,
        expected: "1068781",
      },
      {
        input: `939
17,x,13,19`,
        expected: "3417",
      },
      {
        input: `939
67,7,59,61`,
        expected: "754018",
      },
      {
        input: `939
67,x,7,59,61`,
        expected: "779210",
      },
      {
        input: `939
67,7,x,59,61`,
        expected: "1261476",
      },
      {
        input: `939
1789,37,47,1889`,
        expected: "1202161486",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
