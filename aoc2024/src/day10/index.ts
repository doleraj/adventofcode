import run from "aocrunner";

const parseInput = (rawInput: string) => {
  let startVal = "0";
  let endVal = "9";
  const starts: number[][] = [];
  const ends: number[][] = [];
  const grid = rawInput.split("\n").map((line, y) => {
    return line.split("").map((cell, x) => {
      if (cell === startVal) {
        starts.push([y, x]);
      } else if (cell === endVal) {
        ends.push([y, x]);
      }

      return cell != "." ? Number.parseInt(cell) : -1;
    });
  })

  return { grid, starts, ends };
}

const runDumbWalk = (grid: number[][], start: number[], end: number[]): number => {
  let current: number[];
  let candidates: number[][] = [start];
  let pathCount = 0;
  // console.log(`Look between ${start} and ${end}`)

  while (candidates.length > 0) {
    current = candidates.pop()!!;
    // console.log(`Current now ${current}`)

    if (current[0] == end[0] && current[1] == end[1]) {
      pathCount++;
      continue;
    }

    const validNext = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
      const nextYIndex = current[0] + candidateModifiers[0];
      const nextXIndex = current[1] + candidateModifiers[1];
      if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
        return null;
      }

      const currentVal = grid[current[0]][current[1]];
      const nextVal = grid[nextYIndex][nextXIndex];
      // console.log(`Curr: ${currentVal} Next: ${nextVal}`);
      if (nextVal == currentVal + 1) {
        return [nextYIndex, nextXIndex];
      } else {
        return null;
      }
    }).filter((v): v is number[] => v !== null);

    // console.log(`Valid next places: %o`, validNext);
    candidates.push(...validNext);

  }
  // console.log("Found %o paths", pathCount);
  return pathCount;
}



const part1 = (rawInput: string) => {
  const { grid, starts, ends } = parseInput(rawInput);

  let pathsFound = 0;
  for (let start of starts) {
    for (let end of ends) {
      if (runDumbWalk(grid, start, end) > 0) {
        pathsFound += 1;
      }
    }
  }

  return pathsFound;
};

const part2 = (rawInput: string) => {
  const { grid, starts, ends } = parseInput(rawInput);

  let score = 0;
  for (let start of starts) {
    for (let end of ends) {
      score += runDumbWalk(grid, start, end)
    }
  }

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
        expected: 2,
      },
      {
        input: `
..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 4,
      },
      {
        input: `
10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`,
        expected: 3,
      },
      {
        input: `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`,
        expected: 3,
      },
      {
        input: `
..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 13,
      },
      {
        input: `
012345
123456
234567
345678
4.6789
56789.`,
        expected: 227,
      },
      {
        input: `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
