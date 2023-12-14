import run from "aocrunner";
import "../utils/index.js";
import {memoize} from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => {
    const splits = line.split(" ");
    const runs = splits[1].split(",").map(val => Number.parseInt(val));
    return { springs: splits[0].split(""), runs };
  });
}

const calculateRuns = (possibleArrangement: string[], isFinal: boolean) => {
  const runs = [];
  let runCount = 0;
  for (const place of possibleArrangement) {
    if (place === "#") {
      runCount++;
    }
    else {
      if (runCount) {
        runs.push(runCount);
        runCount = 0;
      }
    }
  }

  // Catch any trailing runs
  if (runCount && isFinal) {
    runs.push(runCount);
  }
  return runs;
}

const isPossibleArrangement = (arrangement: string[], runs: number[]) => {
  const calcedRuns = calculateRuns(arrangement, false);
  const partialRun = runs.slice(0, calcedRuns.length);
  // console.log(`checking ${arrangement} - calced: ${calcedRuns.toString()} - original: ${runs.toString()} - match? ${calcedRuns.toString() === partialRun.toString()}`);
  return calcedRuns.toString() === partialRun.toString();
}

const generateIsPossibleArrangement = (runs: number[]) => {
  return (arrangement: string[]) => {
    return isPossibleArrangement(arrangement, runs);
  };
}

const isPossibleFinalArrangement = (arrangement: string[], runs: number[]) => {
  const calcedRuns = calculateRuns(arrangement, true);
  // console.log(`checking ${arrangement} - calced: ${calcedRuns.toString()} - original: ${runs.toString()} - match? ${calcedRuns.toString() === runs.toString()}`);
  return calcedRuns.toString() === runs.toString();
}

const generateIsPossibleFinalArrangement = (runs: number[]) => {
  return (arrangement: string[]) => {
    return isPossibleFinalArrangement(arrangement, runs);
  };
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((accum, { springs, runs }) => {
    const potentialArrangements: string[][] = [];
    for (let i = 0; i < springs.length; i++) {
      const symbol = springs[i];

      // Handle initial case
      if (i === 0) {
        if (symbol === "." || symbol === "#") {
          potentialArrangements.push([symbol]);
        } else if (symbol === "?") {
          potentialArrangements.push(["#"], ["."]);
        }
        continue;
      }

      const newArrangements = [];
      if (symbol === "." || symbol === "#") {
        while (potentialArrangements.length > 0) {
          const arrangement = potentialArrangements.pop()!!;
          if (isPossibleArrangement(arrangement, runs)) {
            arrangement.push(symbol);
            newArrangements.push(arrangement);
          }
        }
        for (let j = 0; j < potentialArrangements.length; j++) {
          potentialArrangements[j].push(symbol);
        }
      } else if (symbol === "?") {
        while (potentialArrangements.length > 0) {
          const arrangement = potentialArrangements.pop()!!;
          newArrangements.push([...arrangement, "#"]);
          arrangement.push(".");
          newArrangements.push(arrangement);
        }
      }
      const validNewArrangements = newArrangements.filter(generateIsPossibleArrangement(runs));
      potentialArrangements.push(...validNewArrangements);
    }

    const possibleArrangements = potentialArrangements.filter(generateIsPossibleFinalArrangement(runs));
    return accum + possibleArrangements.length;
  }, 0);
};


const checkSprings = memoize((springs: string[], runs: number[]): number => {
  // console.log(`Checking springs... ${springs}, ${runs}`);
  // Check for an empty line
  if (springs.length === 0) {
    if (runs.length === 0) {
      return 1;
    }
    // console.log("empty springs but expected runs");
    return 0;
  }

  // Check about empty runs
  if (runs.length === 0) {
    if (springs.includes("#")) {
      // console.log("Empty runs but runs in result");
      return 0;
    } else {
      return 1;
    }
  }

  // Check that the line is long enough for all runs
  let sum = 0;
  for (const x of runs) {
    sum += x;
  }
  if (springs.length < sum + runs.length - 1) {
    // console.log("Line not long enough for runs")
    return 0;
  }

  const symbol = springs[0];
  let totals = 0;
  if (symbol === "#") {
    // console.log("#");
    const [run, ...leftoverRuns] = runs;
    // console.log(`Checking for run of length ${run} against ${springs}`)
    for (let i = 0; i < run; i++) {
      if (springs[i] === ".") {
        // console.log("There was a space in the expected run");
        return 0;
      }
    }
    if (springs[run] === "#") {
      // console.log("The run didn't go long enough");
      return 0;
    }

    return checkSprings(springs.slice(run + 1), leftoverRuns);
  } else if (symbol === ".") {
    // console.log(".");
    return checkSprings(springs.slice(1), runs);
  } else {
    // console.log("?");
    return checkSprings(["#", ...springs.slice(1)], runs)
         + checkSprings([".", ...springs.slice(1)], runs);
  }
});

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((accum, { springs, runs }) => {
    const actualSprings = [...springs, "?", ...springs, "?", ...springs, "?", ...springs, "?", ...springs];
    const actualRuns = [...runs, ...runs, ...runs, ...runs, ...runs];

    return accum + checkSprings(actualSprings, actualRuns);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `.??..??...?##. 1,1,3`,
        expected: 4,
      },
      {
        input: `?#?#?#?#?#?#?#? 1,3,1,6`,
        expected: 1,
      },
      {
        input: `????.#...#... 4,1,1`,
        expected: 1,
      },
      {
        input: `????.######..#####. 1,6,5`,
        expected: 4,
      },
      {
        input: `?###???????? 3,2,1`,
        expected: 10,
      },
      {
        input: `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `.??..??...?##. 1,1,3`,
        expected: 16384,
      },
      {
        input: `?#?#?#?#?#?#?#? 1,3,1,6`,
        expected: 1,
      },
      {
        input: `????.#...#... 4,1,1`,
        expected: 16,
      },
      {
        input: `????.######..#####. 1,6,5`,
        expected: 2500,
      },
      {
        input: `?###???????? 3,2,1`,
        expected: 506250,
      },
      {
        input: `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
