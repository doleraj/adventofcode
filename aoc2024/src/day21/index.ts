import run from "aocrunner";
import { memoize } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n");

const numericLookupTable: Record<string, Record<string, string[]>> = {
  "A": {
    "A": [""],
    "0": ["<"],
    "1": ["^<<"],
    "2": ["<^", "^<"],
    "3": ["^"],
    "4": ["^^<<"],
    "5": ["^^<", "<^^"],
    "6": ["^^"],
    "7": ["^^^<<"],
    "8": ["^^^<", "<^^^"],
    "9": ["^^^"]
  },
  "0": {
    "A": [">"],
    "0": [""],
    "1": ["<^"],
    "2": ["^"],
    "3": ["^>", ">^"],
    "4": ["^^<"],
    "5": ["^^"],
    "6": ["^^>", ">^^"],
    "7": ["^^^<"],
    "8": ["^^^"],
    "9": ["^^^>", ">^^^"]
  },
  "1": {
    "A": [">>v"],
    "0": [">v"],
    "1": [""],
    "2": [">"],
    "3": [">>"],
    "4": ["^"],
    "5": ["^>", ">^"],
    "6": ["^>>", ">>^"],
    "7": ["^^"],
    "8": ["^^>", ">^^"],
    "9": ["^^>>", ">>^^"]
  },
  "2": {
    "A": ["v>"],
    "0": ["v"],
    "1": ["<"],
    "2": [""],
    "3": [">"],
    "4": ["<^"],
    "5": ["^"],
    "6": ["^>", ">^"],
    "7": ["<^^", "^^<"],
    "8": ["^^"],
    "9": ["^^>", ">^^"]
  },
  "3": {
    "A": ["v"],
    "0": ["<v"],
    "1": ["<<"],
    "2": ["<"],
    "3": [""],
    "4": ["<<^"],
    "5": ["<^"],
    "6": ["^"],
    "7": ["<<^^"],
    "8": ["<^^"],
    "9": ["^^"]
  },
  "4": {
    "A": [">>vv"],
    "0": [">vv"],
    "1": ["v"],
    "2": ["v>"],
    "3": ["v>>"],
    "4": [""],
    "5": [">"],
    "6": [">>"],
    "7": ["^"],
    "8": ["^>", ">^"],
    "9": [">>^", "^>>"]
  },
  "5": {
    "A": ["vv>"],
    "0": ["vv"],
    "1": ["<v"],
    "2": ["v"],
    "3": ["v>"],
    "4": ["<"],
    "5": [""],
    "6": [">"],
    "7": ["<^"],
    "8": ["^"],
    "9": [">^", "^>"]
  },
  "6": {
    "A": ["vv"],
    "0": ["<vv"],
    "1": ["<<v"],
    "2": ["<v"],
    "3": ["v"],
    "4": ["<<"],
    "5": ["<"],
    "6": [""],
    "7": ["<<^"],
    "8": ["<^"],
    "9": ["^"]
  },
  "7": {
    "A": [">>vvv"],
    "0": [">vvv"],
    "1": ["vv"],
    "2": ["vv>"],
    "3": ["vv>>"],
    "4": ["v"],
    "5": ["v>"],
    "6": ["v>>"],
    "7": [""],
    "8": [">"],
    "9": [">>"]
  },
  "8": {
    "A": ["vvv>"],
    "0": ["vvv"],
    "1": ["<vv"],
    "2": ["vv"],
    "3": ["vv>"],
    "4": ["<v"],
    "5": ["v"],
    "6": ["v>"],
    "7": ["<"],
    "8": [""],
    "9": [">"]
  },
  "9": {
    "A": ["vvv"],
    "0": ["<vvv"],
    "1": ["<<vv"],
    "2": ["<vv"],
    "3": ["vv"],
    "4": ["<<v"],
    "5": ["<v"],
    "6": ["v"],
    "7": ["<<"],
    "8": ["<"],
    "9": [""],
  }
}

const findNumericPathForCode = (code: string): string[] => {
  let outputs = [""];
  let currentLabel = "A";

  for (let codeIndex = 0; codeIndex < code.length; codeIndex++) {
    const nextGoal = code.charAt(codeIndex);
    const nextOutputs = [];

    // console.log(`Looking to get from ${currentLabel} to ${nextGoal}`);
    const paths = numericLookupTable[currentLabel][nextGoal];
    for (let output of outputs) {
      for (let path of paths) {
        nextOutputs.push(output + path + "A");
      }
    }
    currentLabel = nextGoal;
    outputs = nextOutputs;
  }
  return outputs;
}

const directionalLookupTable: Record<string, Record<string, string[]>> = {
  "A": {
    "A": [""],
    "^": ["<"],
    ">": ["v"],
    "v": ["<v", "v<"],
    "<": ["v<<"],
  },
  "^": {
    "A": [">"],
    "^": [""],
    ">": ["v>", ">v"],
    "v": ["v"],
    "<": ["v<"],
  },
  ">": {
    "A": ["^"],
    "^": ["<^", "^<"],
    ">": [""],
    "v": ["<"],
    "<": ["<<"],
  },
  "v": {
    "A": ["^>", ">^"],
    "^": ["^"],
    ">": [">"],
    "v": [""],
    "<": ["<"],
  },
  "<": {
    "A": [">>^"],
    "^": [">^"],
    ">": [">>"],
    "v": [">"],
    "<": [""],
  }
}

const findDirectionalPathsForPath = (code: string): string[] => {
  let outputs = [""];
  let currentLabel = "A";

  for (let codeIndex = 0; codeIndex < code.length; codeIndex++) {
    const nextGoal = code.charAt(codeIndex);
    const nextOutputs: string[] = [];

    // console.log(`Looking to get from ${currentLabel} to ${nextGoal}`);
    const paths = directionalLookupTable[currentLabel][nextGoal];
    for (let output of outputs) {
      for (let path of paths) {
        nextOutputs.push(output + path + "A");
      }
    }
    outputs = nextOutputs;
    currentLabel = nextGoal;
  }
  return outputs;
}

const part1 = (rawInput: string) => {
  const codes = parseInput(rawInput);
  return codes.reduce((totalComplexity, code) => {
    const numericPaths = findNumericPathForCode(code);

    const secondDirectionalPathLengths = numericPaths.flatMap(numericPath => explodePath(numericPath, 1, 2));
    const shortestPathLength = Math.min(...secondDirectionalPathLengths);
    const complexity = shortestPathLength * Number.parseInt(code.slice(0, -1));
    return totalComplexity + complexity;
  }, 0);
};

const explodePath = memoize((path: string, iteration: number, maxIteration: number): number => {
  if (iteration === maxIteration) {
    return Math.min(...findDirectionalPathsForPath(path).map(p => p.length));
  }

  const chunks = path.slice(0, -1).split("A");
  return chunks.reduce((output, chunk) => {
     const nextPaths = findDirectionalPathsForPath(chunk + "A");
     const nextPathLengths = nextPaths.map(nextPath => {
       return explodePath(nextPath, iteration + 1, maxIteration);
     });

     output += Math.min(...nextPathLengths);
     return output;
  }, 0);
});

const part2 = (rawInput: string) => {
  const codes = parseInput(rawInput);

  let codeCounter = 1;
  return codes.reduce((totalComplexity, code) => {
    console.log(`Code ${codeCounter++}`)
    let numericPaths = findNumericPathForCode(code)
    const directionalPathLengths = numericPaths.flatMap(numericPath => explodePath(numericPath, 1, 25));

    const shortestPathLength = Math.min(...directionalPathLengths);
    const complexity = shortestPathLength * Number.parseInt(code.slice(0, -1));
    return totalComplexity + complexity;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `029A`,
        expected: 1972,
      },
      {
        input: `
029A
980A
179A
456A
379A`,
        expected: 126384,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
029A
`,
        expected: 2379451789590,
      },
      {
        input: `
029A
980A
179A
456A
379A`,
        expected: 154115708116294,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
