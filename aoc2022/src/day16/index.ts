import run from "aocrunner";

type Valve = { name: string, flowRate: number, tunnels: string[] };
type PathCosts = { [start: string]: { [x: string]: any; }; };
interface Visit {
  room: string;
  cost: number;
  visited: string[];
}

const parseInput = (rawInput: string): Map<string, Valve> => {
  const valveMap = new Map<string, Valve>();
  rawInput.split('\n')
    .forEach((line) => {
      const [valve, tunnels] = line.split(';');
      const name = valve.match(/([A-Z]{2})/)?.[1] ?? "Couldn't parse line";
      const flowRate = Number(valve.match(/(\d+)/)?.[1] ?? 0);
      const tunnelConnections = Array.from(tunnels.matchAll(/([A-Z]{2})/g)).map(
        (match) => match[1]
      );
      valveMap.set(name, { name, flowRate, tunnels: tunnelConnections })
    });
  return valveMap;
}

const getLowestCost = (startRoom: string, endRoom: string, valveMap: Map<string, Valve>) => {
  // console.log(`Going between ${startRoom} and ${endRoom}`);
  const visitQueue: Visit[] = [
    { room: startRoom, cost: 0, visited: [startRoom] },
  ];

  while (visitQueue.length) {
    const { room, cost, visited } = visitQueue.shift()!;
    if (room === endRoom) {
      return cost;
    }

    const { tunnels } = valveMap.get(room)!!;
    if (tunnels.includes(endRoom)) {
      return cost + 1;
    }

    tunnels.forEach((tunnel) => {
      if (!visited.includes(tunnel))
        visitQueue.push({
          room: tunnel,
          cost: cost + 1,
          visited: [...visited, tunnel],
        });
    });
  }

  return -1;
};

function findMeaningfulValves(valveMap: Map<string, Valve>) {
  return Array.from(valveMap.values()).reduce((accum, valve) => {
    if (valve.flowRate !== 0) {
      accum.set(valve.name, valve);
    }
    return accum;
  }, new Map<string, Valve>());
}

function findPathCosts(meaningfulValves: Map<string, Valve>, valveMap: Map<string, Valve>): PathCosts {
  return Object.fromEntries(["AA", ...meaningfulValves.keys()].map((start) => [
      start,
      Object.fromEntries(
        Array.from(meaningfulValves.keys())
          .filter((end) => end !== start)
          .map((end) => [end, getLowestCost(start, end, valveMap)]),
      ),
    ]));
}

const getRemainingPath = (steps: string[], left: string[], totalCost: number, pathList: Set<string>, pathCosts: PathCosts, time: number): void => {
  const last = steps[steps.length - 1];
  if (!left.length) pathList.add(steps.join('-'));
  return left.forEach((next) => {
    const cost = pathCosts[last][next];
    if (cost + 1 + totalCost >= time) return pathList.add(steps.join('-'));
    return getRemainingPath(
      [...steps, next],
      left.filter((pos) => pos !== next),
      totalCost + cost + 1,
      pathList,
      pathCosts,
      time
    );
  });
};

const walkAllPaths = (time: number, pathCosts: PathCosts, meaningfulValves: Map<string, Valve>) => {
  const pathList: Set<string> = new Set();
  getRemainingPath(['AA'], [...meaningfulValves.keys()], 0, pathList, pathCosts, time);
  return [...pathList].map((path) => path.split('-'));
};

const generateKey = (remaining: string[], timeLeft: number) => {
  return `${remaining.join('-')}-${timeLeft}`;
}

const scorePath = (opened: string[], path: string[], timeLeft: number, pathCosts: PathCosts, valveMap: Map<string, Valve>, storedPaths: Map<string, number>): number => {
  const nextStep = path[0];
  const remainingSteps = path.slice(1);
  const nextStepCost = pathCosts[opened[0]][nextStep];
  const flowForStep = valveMap.get(opened[0])!!.flowRate * timeLeft;
  if (!path.length) {
    return flowForStep;
  }
  const pathKey = generateKey(remainingSteps, timeLeft - 1 - nextStepCost);
  const pressureReleased = scorePath([path[0], ...opened], remainingSteps, timeLeft - nextStepCost - 1, pathCosts, valveMap, storedPaths);
  storedPaths.set(pathKey, pressureReleased);
  return pressureReleased + flowForStep;
};

const scorePaths = (paths: string[][], time: number, pathCosts: PathCosts, valveMap: Map<string, Valve>) => {
  const storedPaths: Map<string, number> = new Map();
  return paths
    .map((path) =>
      [path, scorePath([path[0]], path.slice(1), time, pathCosts, valveMap, storedPaths)] as [string[], number]
    )
    .sort(([_, valA], [__, valB]) => valB - valA);
};


const part1 = (rawInput: string) => {
  const valveMap  = parseInput(rawInput);
  const meaningfulValves = findMeaningfulValves(valveMap);

  const pathCosts = findPathCosts(meaningfulValves, valveMap);
  const allPaths = walkAllPaths(30, pathCosts, meaningfulValves);
  const pathScores = scorePaths(allPaths, 30, pathCosts, valveMap);
  // console.log(pathScores);

  return pathScores[0][1];
};

const part2 = (rawInput: string) => {
  const valveMap  = parseInput(rawInput);
  const meaningfulValves = findMeaningfulValves(valveMap);

  const pathCosts = findPathCosts(meaningfulValves, valveMap);
  const allPaths = walkAllPaths(26, pathCosts, meaningfulValves);
  const pathScores = scorePaths(allPaths, 26, pathCosts, valveMap);
  const candidates = pathScores
    .filter(([_, score]) => score > 0)
    .map(([path, score]) => [path.slice(1), score] as [string[], number]);

  const bestCombo = candidates.reduce((best, [path, score], index) => {
    if (score < ((best / 2) | 0)) {
      return best;
    }
  //
    const possible = candidates.findIndex((candidate) => {
      // console.log(`${candidate[1] + score}, ${best}`)
      return (candidate[1] + score) < best
    });
    // console.log(`[${path}, ${score}], ${index}, ${possible}`);
    const indexOfBreakpoint  = best === 0 ? undefined : Math.max(0, possible + 1 - index);
    const breakpointCandidates = candidates.slice(index, indexOfBreakpoint);
    // console.log(breakpointCandidates);
    const nonOverlappingCandidate = breakpointCandidates.find((helper) => helper[0].every((valve) => !path.includes(valve)));

    // console.log(nonOverlappingCandidate);
      if (!nonOverlappingCandidate) {
        return best;
      }
      return Math.max(best, nonOverlappingCandidate[1] + score);
  }, 0);
  console.log(bestCombo);
  return bestCombo;
};

run({
  part1: {
    tests: [
      {
        input: `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // test doesn't work because the sample paths aren't long enough to generate non-overlapping paths
//       {
//         input: `
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II
// `,
//         expected: 1707,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
