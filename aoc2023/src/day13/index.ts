import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => {
  const patterns = rawInput.split("\n\n").map(pattern => pattern.trim().split("\n"));
  const horizontalLinePatterns = patterns;
  const verticalLinePatterns = patterns.map(pattern => {
    const patternSplitIntoChars = pattern.map(line => line.split(""));
    return patternSplitIntoChars[0].map((_, colIndex) => pattern.map(row => row[colIndex]).join(""));
  });
  return { horizontalLinePatterns, verticalLinePatterns };
}

function checkLine(pattern: string[], i: number) {
  // If we have an immediate match...
  if (pattern[i] === pattern[i + 1]) {
    // Walk both backwards and forwards
    let iteration = 0;
    let reflects = false;
    while ((i - iteration) >= 0 && (i + 1 + iteration) < pattern.length) {
      // console.log(`Checking ${pattern[i - iteration]} against ${pattern[i + 1 + iteration]}`);
      reflects = pattern[i - iteration] === pattern[i + 1 + iteration];
      if (!reflects) {
        // console.log("No match, breaking");
        break;
      }
      iteration++;
    }

    if (reflects) {
      return i;
    }
  }
  return -1;
}

const part1 = (rawInput: string) => {
  const { horizontalLinePatterns, verticalLinePatterns } = parseInput(rawInput);
  // console.log(verticalLinePatterns);

  let total = 0;
  for (let patternIndex = 0; patternIndex < horizontalLinePatterns.length; patternIndex++) {

    // Look for horizontal lines of reflection first, simply because it's easier... or I thought it was
    const horizontalPattern = horizontalLinePatterns[patternIndex];
    let hReflectionPoint = -1;
    for (let i = 0; i < horizontalPattern.length; i++) {
      const result = checkLine(horizontalPattern, i);
      if (result !== -1) {
        hReflectionPoint = result;
      }
      // console.log(`Found H reflection at ${hReflectionPoint}`);
    }
    if (hReflectionPoint !== -1) {
      total += 100 * (hReflectionPoint + 1);
    }

    // Then look for vertical lines of reflection
    const verticalPattern = verticalLinePatterns[patternIndex];
    let vReflectionPoint = -1;
    for (let i = 0; i < verticalPattern.length; i++) {
      const result = checkLine(verticalPattern, i);
      if (result !== -1) {
        vReflectionPoint = result;
      }
      // console.log(`Found V reflection at ${vReflectionPoint}`);
    }
    if (vReflectionPoint !== -1) {
      total += vReflectionPoint + 1;
    }
  }

  // 31368 too low
  // 31377 too low
  return total;
};

function checkLineWithDeltas(pattern: string[], i: number) {
  // If we have an immediate match...
  let totalDelta = 0;
  if (findDeltaBetweenLines(pattern[i], pattern[i + 1]) < 2) {
    // Walk both backwards and forwards
    let iteration = 0;
    while ((i - iteration) >= 0 && (i + 1 + iteration) < pattern.length) {
      // console.log(`Checking ${pattern[i - iteration]} against ${pattern[i + 1 + iteration]}, total error ${totalDelta}`);
      totalDelta += findDeltaBetweenLines(pattern[i - iteration], pattern[i + 1 + iteration]);
      if (totalDelta > 1) {
        // console.log("More than 1 errors, breaking");
        break;
      }
      iteration++;
    }

    // console.log(`Final delta: ${totalDelta}`);
    // ONLY COUNT MATCHES WITH ONE ERROR TO AVOID COUNTING THE ORIGINAL
    if (totalDelta === 1) {
      // console.log(`Going to return ${i}?`);
      return i;
    }
  }
  return -1;
}

const findDeltaBetweenLines = (lineA: string, lineB: string) => {
  let errors = 0;
  // For this we can assume the same length
  for (let i = 0; i < lineA.length; i++) {
    if (lineA[i] !== lineB[i]) {
      errors++;
    }
  }
  return errors;
};

const part2 = (rawInput: string) => {
  const { horizontalLinePatterns, verticalLinePatterns } = parseInput(rawInput);

  let total = 0;
  let misses = 0;
  for (let patternIndex = 0; patternIndex < horizontalLinePatterns.length; patternIndex++) {

    // Look for horizontal lines of reflection first, simply because it's easier... or I thought it was
    const horizontalPattern = horizontalLinePatterns[patternIndex];
    let hReflectionPoint = -1;
    for (let i = 0; i < horizontalPattern.length - 1; i++) {
      const result = checkLineWithDeltas(horizontalPattern, i);
      if (result !== -1) {
        hReflectionPoint = result;
      }
      // console.log(`Found H reflection at ${hReflectionPoint}`);
    }
    if (hReflectionPoint !== -1) {
      total += 100 * (hReflectionPoint + 1);
      continue;
    }

    // Then look for vertical lines of reflection
    const verticalPattern = verticalLinePatterns[patternIndex];
    let vReflectionPoint = -1;
    for (let i = 0; i < verticalPattern.length - 1; i++) {
      const result = checkLineWithDeltas(verticalPattern, i);
      if (result !== -1) {
        vReflectionPoint = result;
      }
      // console.log(`Found V reflection at ${vReflectionPoint}`);
    }
    if (vReflectionPoint !== -1) {
      total += vReflectionPoint + 1;
    } else {
      misses++;
      // console.log(`Missed pattern ${verticalPattern}`);
    }
  }
  // console.log(`Didn't find a reflection point for ${misses} patterns!`);

  // 17488 too low
  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.`,
        expected: 5,
      },
      {
        input: `
#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
      {
        input: `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
      {
        input: `
#..#.....
.##.##..#
####..###
#..###.##
#..#.###.
####.....
....#..#.
#####....
#####....
....#..#.
####....#
#..#.###.
#..###.##`,
        expected: 2,
      },
      {
        input: `
##..#....#..####.
#.###.##.###.##.#
##.########.####.
..##.####.##....#
..##.####.##....#
#..#.#..#.#..##..
.#...####...#..#.
#............##..
###...##...######
....#....#......#
#.#.#....#.#.##.#
###.######.######
...#......#......`,
        expected: 7,
      },
      {
        input: `
.#.#..########.
#.#.#.#.####.#.
.####.#..##..#.
#.##.#.##..##.#
##..##........#
.###.#.#.##.#.#
..#............
.#..#...#..#...
.#..#...#..#...
..#............
.###.#.#.##.#.#
##..##........#
#.####.##..##.#`,
        expected: 10,
      },
      {
        input: `
#####.##.
......#.#
#####..#.
.##..#...
####..##.
#..###..#
.##..#.##
.##..#..#
#..###..#`,
        expected: 2,
      },
      {
        input: `
.#.##.#.#..#.
....#....#..#
.#..####..##.
..#.#########
....#.....##.
.#####.#..##.
#..#...###..#
###..#.###..#
#.#..#.##....
...#.....####
..#...#......
..#...#.##..#
..#.##..#####
..#.##..#####
..#...#.##..#`,
        expected: 1300,
      },
      {
        input: `
#...######.
..#.######.
####.#..###
.#...#..#..
###.#.##.#.
.#..#....#.
##.#.#..#.#
##.#.#..#.#
.#..#....#.
###.#.##.#.
.#...#..#..`,
        expected: 700,
      },
      {
        input: `
...#.#.#.####.#.#
..###..###..###..
##.###..........#
....####...#..###
...#.#...#..#...#
##...##.##..##.##
###..##.#....#.##
..##.##...##...##
##.##............`,
        expected: 1,
      },
      {
        input: `
#.##.##..#....##.
#..####...#..##.#
.#...####.##..###
.#...####.##..###
#..####...#..##.#
#.##..#..#....##.
.....#.####..#...
.##..###..#######
.##..###..#######
.....#.####..#...
#.##..#..#....##.`,
        expected: 800,
      },
      {
        input: `
.#..#....#..#.###
.####.##.####....
.#.#.####.#.#.#..
...........#..#..
####.#..#.####...
##..#.##.#..##.##
.############.#..`,
        expected: 16,
      },
      {
        input: `
#..#....#
#..##....
....#..#.
#..#.#..#
...##...#
#..##...#
#..##.#..
......#.#
.##.#..##
.......#.
####.###.
####.###.
.......#.`,
        expected: 1100,
      },
      {
        input: `
#.##..#
....##.
..####.
.###.##
.###.##
.#####.
....##.
#.##..#
.#....#
.#.###.
#......
##.#.##
##.#.##`,
        expected: 1200,
      },
      {
        input: `
.###..####....#.#
.#....##.#.##..##
.#....##.#.##..##
.###..####....#.#
#....##.###.##.##
#.##...#.#..#.##.
######..######...
..##..###...###..
#..####.#.#..#.##
#..####.#.#..#.##
..##..####..###..`,
        expected: 200,
      },
      {
        input: `
..##......#
##.#.#..#.#
##..#.##.#.
...##....##
#####....##
#####.##.##
..#...##.#.
##.........
##...#..#..
##.##....##
##..##..##.`,
        expected: 1,
      },
      {
        input: `
...#....##.
...#..##..#
###.#...##.
##..##.#..#
.###.###..#
###.##..##.
##.##..####
##.#.#..##.
.....#.#..#
..#########
##...#.####
...#..##..#
....#.#.##.`,
        expected: 9,
      },
      {
        input: `
##.....#.#.
###....#.#.
...#.###.#.
.###..##..#
####.#.#...
..#.#####.#
..####..###
#.##.###.##
#.#.##.#..#
#.#.##.#..#
#.##.###.##`,
        expected: 900,
      },
      {
        input: `
..#..#..#..#.
.#####..####.
.##..##.####.
.#.##.#.####.
###..####..##
##.##.###..##
#.#..#.##..##
..####.......
..####..#..#.
..#..#.......
##....#######
###..########
...##........`,
        expected: 10,
      },
      {
        input: `
#........
...##....
#.#..#.##
.#....#..
#.####.##
.#....#..
.#.##.#..
#......##
##....###
#..##..##
.#....#..`,
        expected: 8,
      },
      {
        input: `
..##..#..#.
.###.##.###
##.##...#..
..#.###.#..
##.....##..
#.###....##
#.###....##
##.....##..
..#.###.#..
##.###..#..
.###.##.###
..##..#..#.
..#......#.
###.#.##.#.
.#..#.##.##
#...#...##.
#...#...##.`,
        expected: 1600,
      },
      {
        input: `
#..#..#.#.....#
####.####.##.#.
.##....#.#...#.
.....#..#...###
#..#..#.##.##.#
####.....####..
#####.....###.#
.##.##.###..###
#..#.#.#.#..##.
#####..#..##.##
.##..#......#..
#####.....#..#.
###########..#.
###########..#.
#####.#...#..#.
.##..#......#..
#####..#..##.##`,
        expected: 2,
      },
      {
        input: `
#.##.#..###.#..#.
.####..#..#..##.#
..##...##.##.....
..##...#...###..#
......#..###....#
........#..#.##..
#....##.#.#..##..
..##..##.###.##.#
..##..##.###.##.#
#....##.#.#..##..
........#..#.##..
......#..##.....#
..##...#...###..#`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.`,
        expected: 300,
      },
      {
        input: `
#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 100,
      },
      {
        input: `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
      {
        input: `
#.#..###.##
.###.##....
.#..###.###
#.#.#.#..##
#.#.#.#..##
.#..#.#.###
.###.##....
#.#..###.##
##...#.#...
#..###..###
###.....#..
####..#.#..
#..#..#..##
#..###.#...
....#....##
..##..###..
########.##
`,
        expected: 400,
      },
      {
        input: `
#.##.#..###
#......#.##
#.#..###.##
##......#..
##......#..
#.#..###.##
#......#.##
#.##.#..###
.##.#.####.
#..#...##..
###.##.####
.#....##.##
...#....###
`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
