import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let total = 0;
  for (let index in lines) {
    // console.log(index)
    const parts = lines[index].split(" ");
    const score = calculateScore1(parts[0], parts[1]);
    total += score;
    // console.log(`${parts} - ${score} - ${total}`);
    // console.log(total)
  }

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let total = 0;
  for (let index in lines) {
    // console.log(index)
    const parts = lines[index].split(" ");
    const score = calculateScore2(parts[0], parts[1]);
    total += score;
    // console.log(`${parts} - ${score} - ${total}`);
    // console.log(total)
  }

  return total;
};

const calculateScore1 = (opponent: string, me: string): number => {
  let score = 0;

  switch (opponent) {
    case "A":
      switch (me) {
        case "X": score += 4; break;
        case "Y": score += 8; break;
        case "Z": score += 3; break;
      }
      break;
    case "B":
      switch (me) {
        case "X": score += 1; break;
        case "Y": score += 5; break;
        case "Z": score += 9; break;
      }
      break;
    case "C":
      switch (me) {
        case "X": score += 7; break;
        case "Y": score += 2; break;
        case "Z": score += 6; break;
      }
      break;
  }
  return score;
}

const calculateScore2 = (opponent: string, me: string): number => {
  let score = 0;

  switch (opponent) {
    case "A":
      switch (me) {
        case "X": score += 3; break;
        case "Y": score += 4; break;
        case "Z": score += 8; break;
      }
      break;
    case "B":
      switch (me) {
        case "X": score += 1; break;
        case "Y": score += 5; break;
        case "Z": score += 9; break;
      }
      break;
    case "C":
      switch (me) {
        case "X": score += 2; break;
        case "Y": score += 6; break;
        case "Z": score += 7; break;
      }
      break;
  }
  return score;
}

run({
  part1: {
    tests: [
      {
        input: `
A Y
B X
C Z`,
        expected: 15,
      },
      {
        input: `
A X
A Y
A Z
B X
B Y
B Z
C X
C Y
C Z`,
        expected: 45,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
