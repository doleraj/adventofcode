import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const last4 = [] as string[];
  let foundMarker = false;
  let index = 0;
  const chars = input.split("");

  while (!foundMarker && index <= chars.length) {
    last4.push(chars[index++]);
    if (last4.length > 4) {
      last4.shift();
    }

    foundMarker =
      last4[0] !== last4[1] &&
      last4[0] !== last4[2] &&
      last4[0] !== last4[3] &&
      last4[0] !== last4[4] &&
      last4[1] !== last4[2] &&
      last4[1] !== last4[3] &&
      last4[1] !== last4[4] &&
      last4[2] !== last4[3] &&
      last4[2] !== last4[4] &&
      last4[3] !== last4[4];
    // console.log(last4);
  }

  return foundMarker ? index : -1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const last14 = [] as string[];
  let foundMarker = false;
  let index = 0;
  const chars = input.split("");

  while (!foundMarker && index <= chars.length) {
    last14.push(chars[index++]);
    if (last14.length > 14) {
      last14.shift();
    }
    const set = new Set(last14);
    foundMarker = set.size === 14;

    // console.log(last4);
  }


  return foundMarker ? index : -1;
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
