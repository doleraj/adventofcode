import run from "aocrunner";
import { memoize } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n").map(l => Number.parseInt(l));

const part1 = (rawInput: string) => {
  let adapters = parseInput(rawInput);
  const deviceJoltage = Math.max(...adapters) + 3;
  let currentJoltage = 0;
  let oneJoltageJumps = 0;
  let threeJoltageJumps = 0;

  while (adapters.length > 0) {
    const validAdapters = adapters.filter(adapter => adapter <= currentJoltage + 3);
    const nextAdapter = Math.min(...validAdapters);
    // console.log(`Next adapter ${nextAdapter}, delta ${nextAdapter - currentJoltage}`);
    nextAdapter - currentJoltage === 1 ? oneJoltageJumps++ : threeJoltageJumps++;
    // console.log(`index ${adapters.findIndex(adapter => adapter === nextAdapter)}`);
    adapters.splice(adapters.findIndex(adapter => adapter === nextAdapter), 1);
    currentJoltage = nextAdapter;
  }
  threeJoltageJumps++;

  return oneJoltageJumps * threeJoltageJumps;
};

const makeStep = memoize((currentJoltage: number, deviceJoltage: number, adaptersRemaining: number[]): number => {
  if (currentJoltage === deviceJoltage) {
    // console.log(adaptersUsed.join(","));
    return 1;
  }

  const validAdapters = adaptersRemaining.filter(adapter => adapter > currentJoltage && adapter <= currentJoltage + 3);
  if (deviceJoltage <= currentJoltage + 3) {
    validAdapters.push(deviceJoltage);
  }

  if (validAdapters.length === 0) {
    return 0;
  }

  return validAdapters.reduce((total, nextAdapter) => {
    const nextAdapters = adaptersRemaining.slice();
    nextAdapters.splice(adaptersRemaining.findIndex(adapter => adapter === nextAdapter), 1);
    return total + makeStep(nextAdapter, deviceJoltage, nextAdapters);
  }, 0);
}, (currentJoltage, deviceJoltage, adaptersRemaining) => `${currentJoltage}-${deviceJoltage}`);

const part2 = (rawInput: string) => {
  let adapters = parseInput(rawInput);
  adapters.sort();
  const deviceJoltage = Math.max(...adapters) + 3;

  return makeStep(0, deviceJoltage, adapters);
};

run({
  part1: {
    tests: [
      {
        input: `
16
10
15
5
1
11
7
19
6
12
4`,
        expected: 35,
      },
      {
        input: `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`,
        expected: 220,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
16
10
15
5
1
11
7
19
6
12
4`,
        expected: 8,
      },
      {
        input: `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`,
        expected: 19208,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
