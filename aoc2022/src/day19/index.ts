import run from "aocrunner";
import _ from "lodash";

interface State {
  minute: number;
  ore: number;
  clay: number;
  obsidian: number;
  geodes: number;
  oreRobots: number;
  clayRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
  // log: string[];
}

interface Blueprint {
  number: number;
  ore: { ore: number; },
  clay: { ore: number; },
  obsidian: { ore: number; clay: number; },
  geode: { ore: number; obsidian: number; },
}

const INITIAL_STATE: State = {
  minute: 1,
  ore: 0,
  clay: 0,
  obsidian: 0,
  geodes: 0,
  oreRobots: 1,
  clayRobots: 0,
  obsidianRobots: 0,
  geodeRobots: 0,
}

const geodePossibleBuild = {
  applyCosts: (state: State, blueprint: Blueprint) => {
    // state.log.push(`Spend ${blueprint.geode.ore} and ${blueprint.geode.obsidian} to start building a geode-cracking robot.`);
    state.ore -= blueprint.geode.ore;
    state.obsidian -= blueprint.geode.obsidian;
  },
  updateRobotCount: (state: State) => {
    state.geodeRobots++;
    // state.log.push(`The new geode-cracking robot is ready; you now have ${state.obsidianRobots} of them.`);
  },
}

const obsidianPossibleBuild = {
  applyCosts: (state: State, blueprint: Blueprint) => {
    state.ore -= blueprint.obsidian.ore;
    state.clay -= blueprint.obsidian.clay;
  },
  updateRobotCount: (state: State) => {
    state.obsidianRobots++;
  },
}

const clayPossibleBuild = {
  applyCosts: (state: State, blueprint: Blueprint) => {
    state.ore -= blueprint.clay.ore;
  },
  updateRobotCount: (state: State) => {
    state.clayRobots++;
  },
}

const orePossibleBuild = {
  applyCosts: (state: State, blueprint: Blueprint) => {
    state.ore -= blueprint.ore.ore;
  },
  updateRobotCount: (state: State) => {
    state.oreRobots++;
  },
}

const noopBuild = {
  applyCosts: () => {},
  updateRobotCount: () => {},
}

const parseInput = (rawInput: string): Blueprint[] => {
  return rawInput.split("\n").map(blueprint => {
    const match = blueprint.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian/)!!;
    return { number: Number(match[1]),
      ore: { ore: Number(match[2]) },
      clay: { ore: Number(match[3]) },
      obsidian: { ore: Number(match[4]), clay: Number(match[5]) },
      geode: { ore: Number(match[6]), obsidian: Number(match[7]) }
    };
  });
}

function findPossibleRobotBuilds(state: State, blueprint: Blueprint) {
  const possibleRobotBuilds = [];
  // If we can build a geode robot, do it and skip any other checking.
  if (state.ore >= blueprint.geode.ore && state.obsidian >= blueprint.geode.obsidian) {
    possibleRobotBuilds.push(geodePossibleBuild);
  } else {
    if (state.ore >= blueprint.obsidian.ore && state.clay >= blueprint.obsidian.clay) {
      possibleRobotBuilds.push(obsidianPossibleBuild);
    }

    if (state.ore >= blueprint.clay.ore) {
      possibleRobotBuilds.push(clayPossibleBuild);
    }
    if (state.ore >= blueprint.ore.ore) {
      possibleRobotBuilds.push(orePossibleBuild);
    }
    // NOOP ONLY if we have less than we need to make the most expensive robot
    if (state.ore < blueprint.geode.ore || state.obsidian < blueprint.geode.obsidian) {
      possibleRobotBuilds.push(noopBuild);
    }
  }

  return possibleRobotBuilds;
}

function* runMinute(state: State, blueprint: Blueprint): Generator<State> {


  const possibleRobotBuilds = findPossibleRobotBuilds(state, blueprint);
  // console.log(possibleRobotBuilds);
  for (const build of possibleRobotBuilds) {
    const nextState = _.clone(state);
    build.applyCosts(nextState, blueprint);

    // Mine
    nextState.ore += nextState.oreRobots;

    if (nextState.clayRobots > 0) {
      nextState.clay += nextState.clayRobots;
    }
    if (nextState.obsidianRobots > 0) {
      nextState.obsidian += nextState.obsidianRobots;
    }
    if (nextState.geodeRobots > 0) {
      nextState.geodes += nextState.geodeRobots;
    }

    build.updateRobotCount(nextState);
    nextState.minute++;
    yield nextState;
  }
}

const scoreState = (state: State): number => {
  return (
    (
      (state.geodes + state.geodeRobots) * 1000
      + (state.obsidian + state.obsidianRobots)
    ) * 1000
    + (state.clay + state.clayRobots)
  ) * 1000
    + (state.ore + state.oreRobots);
}

const part1 = (rawInput: string) => {
  const blueprints = parseInput(rawInput);

  const qualityLevel = blueprints.reduce((accum, blueprint) => {
    let minute = 1;
    let states: State[] = [INITIAL_STATE];
    // let bestState: State;
    while (minute <= 24) {
      const nextStates = states.flatMap(
        state => {
          return [...runMinute(state, blueprint)];
        }
      );
      states = [...nextStates.sort((a, b) => scoreState(b) - scoreState(a)).slice(0, 1_000_000)];
      console.log(`minute ${minute} next states: ${nextStates.length}, culled states: ${states.length}`);
      minute++;
    }
    let bestState = states.sort((a, b) => b.geodes - a.geodes)[0];
    const bestStateGeodes = bestState ? bestState.geodes : 0;
    console.log(`best geodes for ${blueprint.number}: ${bestStateGeodes}`);
    const score = blueprint.number * bestStateGeodes;

    return accum + score;
  }, 0);

  console.log(qualityLevel);

  return qualityLevel;
  // 1205 is too low
};

const part2 = (rawInput: string) => {
  const blueprints = parseInput(rawInput).slice(0, 3);

  const geodeProduct = blueprints.reduce((accum, blueprint) => {
    let minute = 1;
    let states: State[] = [INITIAL_STATE];
    // let bestState: State;
    while (minute <= 32) {
      const nextStates = states.flatMap(
        state => {
          // const minutesLeft = (24 - state.minute);
          // const possibleObsidian = minutesLeft * state.obsidianRobots;
          // if (minutesLeft < (blueprint.geode.obsidian - possibleObsidian) && state.obsidianRobots === 0) {
          //   return [];
          // }
          return [...runMinute(state, blueprint)];
        }
      );
      states = [...nextStates.sort((a, b) => scoreState(b) - scoreState(a)).slice(0, 100_000)];
      console.log(`minute ${minute} next states: ${nextStates.length}, culled states: ${states.length}`);
      minute++;
    }
    let bestState = states.sort((a, b) => b.geodes - a.geodes)[0];
    const bestStateGeodes = bestState ? bestState.geodes : 0;
    console.log(`best geodes for ${blueprint.number}: ${bestStateGeodes}`);

    return accum * bestStateGeodes;
  }, 1);

  console.log(geodeProduct);

  return geodeProduct;
};

run({
  part1: {
    tests: [
      {
        input: `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`,
        expected: 33,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`,
        expected: 3472,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
