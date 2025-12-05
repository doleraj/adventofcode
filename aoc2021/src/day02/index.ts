import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n")
  .map((line) => {
    const match = line.match(/(forward|down|up) (\d+)/)
    return { direction: match?.[1], amount: Number.parseInt(match?.[2] ?? "") };
  });

const part1 = (rawInput: string) => {
  const instructions = parseInput(rawInput);

  const finalPos = instructions.reduce((acc, cur) => {

    if (cur.direction === "forward") {
      acc.h += cur.amount;
    } else if (cur.direction === "up") {
      acc.d -= cur.amount;
    } else if (cur.direction === "down") {
      acc.d += cur.amount;
    }

    return acc;
  }, {h: 0, d: 0})

  return finalPos.d * finalPos.h;
};

const part2 = (rawInput: string) => {
  const instructions = parseInput(rawInput);

  const finalPos = instructions.reduce((acc, cur) => {

    if (cur.direction === "forward") {
      acc.h += cur.amount;
      acc.d += acc.a * cur.amount;
    } else if (cur.direction === "up") {
      acc.a -= cur.amount;
    } else if (cur.direction === "down") {
      acc.a += cur.amount;
    }

    return acc;
  }, {h: 0, d: 0, a: 0})

  return finalPos.d * finalPos.h;
};

run({
  part1: {
    tests: [
      {
        input: `
forward 5
down 5
forward 8
up 3
down 8
forward 2`,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
forward 5
down 5
forward 8
up 3
down 8
forward 2`,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
