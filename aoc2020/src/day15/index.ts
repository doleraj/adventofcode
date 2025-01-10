import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(",");

const part1 = (rawInput: string) => {
  const numbers = parseInput(rawInput);

  const previousPreviousNumberTracker: Record<number, number> = {};
  let lastNumberSpoken = -1;
  numbers.forEach((numberStr, index) => {
    previousPreviousNumberTracker[lastNumberSpoken] = index;
    lastNumberSpoken = Number.parseInt(numberStr);
  });

  let turn = numbers.length + 1;
  while (turn < 2021) {
    if (previousPreviousNumberTracker[lastNumberSpoken] === undefined) {
      // console.log(`New number ${lastNumberSpoken}, last spoken last turn.`);
      previousPreviousNumberTracker[lastNumberSpoken] = turn - 1;
      lastNumberSpoken = 0;
    } else {
      const previousLastSpokenTurn = previousPreviousNumberTracker[lastNumberSpoken];
      // console.log(`Existing number, previous previous turn ${previousLastSpokenTurn}, previous turn ${turn - 1}, current turn ${turn}`);
      previousPreviousNumberTracker[lastNumberSpoken] = turn - 1;
      lastNumberSpoken = (turn - 1) - previousLastSpokenTurn;
    }
    turn++;
  }


  return lastNumberSpoken;
};

const part2 = (rawInput: string) => {
  const numbers = parseInput(rawInput);

  const previousPreviousNumberTracker = new Map<number, number>();
  let lastNumberSpoken = -1;
  numbers.forEach((numberStr, index) => {
    previousPreviousNumberTracker.set(lastNumberSpoken, index);
    lastNumberSpoken = Number.parseInt(numberStr);
  });

  let turn = numbers.length + 1;
  while (turn < 30000001) {
    if (turn % 1000000 === 0) {
      // console.log(turn);
    }

    if (previousPreviousNumberTracker.get(lastNumberSpoken) === undefined) {
      // console.log(`New number ${lastNumberSpoken}, last spoken last turn.`);
      previousPreviousNumberTracker.set(lastNumberSpoken, turn - 1);
      lastNumberSpoken = 0;
    } else {
      const previousLastSpokenTurn = previousPreviousNumberTracker.get(lastNumberSpoken)!!;
      // console.log(`Existing number, previous previous turn ${previousLastSpokenTurn}, previous turn ${turn - 1}, current turn ${turn}`);
      previousPreviousNumberTracker.set(lastNumberSpoken, turn - 1);
      lastNumberSpoken = (turn - 1) - previousLastSpokenTurn;
    }
    turn++;
  }

  return lastNumberSpoken;
};

run({
  part1: {
    tests: [
      {
        input: `0,3,6`,
        expected: 436,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0,3,6`,
        expected: 175594,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
