import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [keys, locks] = rawInput.split("\n\n").reduce(([keys, locks], block) => {
    const lines = block.split("\n").map(line => line.split("").map(char => char === "#" ? 1 : 0));

    if (lines[0].join("") === "11111") {
      locks.push([
        lines[1][0] + lines[2][0] + lines[3][0] + lines[4][0] + lines[5][0] + lines[6][0],
        lines[1][1] + lines[2][1] + lines[3][1] + lines[4][1] + lines[5][1] + lines[6][1],
        lines[1][2] + lines[2][2] + lines[3][2] + lines[4][2] + lines[5][2] + lines[6][2],
        lines[1][3] + lines[2][3] + lines[3][3] + lines[4][3] + lines[5][3] + lines[6][3],
        lines[1][4] + lines[2][4] + lines[3][4] + lines[4][4] + lines[5][4] + lines[6][4],
      ]);
    } else {
      keys.push([
        lines[0][0] + lines[1][0] + lines[2][0] + lines[3][0] + lines[4][0] + lines[5][0],
        lines[0][1] + lines[1][1] + lines[2][1] + lines[3][1] + lines[4][1] + lines[5][1],
        lines[0][2] + lines[1][2] + lines[2][2] + lines[3][2] + lines[4][2] + lines[5][2],
        lines[0][3] + lines[1][3] + lines[2][3] + lines[3][3] + lines[4][3] + lines[5][3],
        lines[0][4] + lines[1][4] + lines[2][4] + lines[3][4] + lines[4][4] + lines[5][4],
      ]);
    }

    return [keys, locks];
  }, [[] as number[][], [] as number[][]]);

  return { keys, locks };
}

const part1 = (rawInput: string) => {
  const { keys, locks } = parseInput(rawInput);

  const result = keys.reduce((keysSum, key) => {
    return keysSum + locks.reduce((lockSum, lock) => {
      if (key[0] + lock[0] < 6
        && key[1] + lock[1] < 6
        && key[2] + lock[2] < 6
        && key[3] + lock[3] < 6
        && key[4] + lock[4] < 6) {
        lockSum++;
      }

      return lockSum;
    }, 0);
  }, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
