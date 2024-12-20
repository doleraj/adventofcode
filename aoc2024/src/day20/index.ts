import run from "aocrunner";
import { DijkstrasCoordinate, manhattanDistance, manhattanDistanceCoord, toSetToken } from "../utils/index.js";

type Coordinate = { y: number; x: number };

const parseInput = (rawInput: string) => {
  let start: Coordinate = { y: -1, x: -1 };
  let end: Coordinate = { y: -1, x: -1 };
  const grid = rawInput.split("\n").map((line, y) => {
    return line.split("").map((cell, x) => {
      if (cell === "S") {
        start = { y, x };
        return 1;
      } else if (cell === "E") {
        end = { y, x };
        return 1;
      } else if (cell == ".") {
        return 1;
      } else {
        return Number.POSITIVE_INFINITY;
      }
    });
  });

  return { start, end, grid };
}

const generateNeighbors = (currentNode: Coordinate, visited: Set<string>, grid: number[][]) => {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
    const nextYIndex = currentNode.y + candidateModifiers[0];
    const nextXIndex = currentNode.x + candidateModifiers[1];
    if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
      return null;
    }
    const next = { y: nextYIndex, x: nextXIndex };
    if (visited.has(toSetToken(next))) {
      return null;
    }

    return next;
  }).filter(val => val != null) as Coordinate[];
}

const part1 = (rawInput: string) => {
  const { start, end, grid } = parseInput(rawInput);

  const cheatsTrackingMap: Map<string, Map<string, number>> = new Map();
  const cheats: Record<string, number> = {};
  const visited = new Set<string>(toSetToken(start));
  let current: Coordinate = start;
  let distance = 0;
  while (!(current.y === end.y && current.x === end.x)) {
    // console.log(`Visiting %o`, current);
    const currentSetToken = toSetToken(current);
    visited.add(currentSetToken);

    const cheatsThatEndHere = cheatsTrackingMap.get(currentSetToken);
    if (cheatsThatEndHere) {
      for (const cheat of cheatsThatEndHere) {
        if (distance - cheat[1] > 0) {
          // console.log(`registering cheat from ${cheat[0]}. current distance ${distance}, distance when cheat registered ${cheat[1]}`)
          cheats[`${cheat[0]} - ${currentSetToken}`] = distance - cheat[1];
        }
      }
    }

    const neighbors = generateNeighbors(current, visited, grid);
    for (const neighbor of neighbors) {
      if (grid[neighbor.y][neighbor.x] === Number.POSITIVE_INFINITY) {
        const cheatOutputs = generateNeighbors(neighbor, visited, grid)
          .filter(endpoint => grid[endpoint.y][endpoint.x] !== Number.POSITIVE_INFINITY);

        if (cheatOutputs.length > 0) {
          // console.log(`found potential cheat %o`, neighbor);
          const originKey = toSetToken(current);
          for (const cheatOutput of cheatOutputs) {
            const destKey = toSetToken(cheatOutput);
            if (!cheatsTrackingMap.has(destKey)) {
              cheatsTrackingMap.set(destKey, new Map());
            }

            // console.log(`cheat between ${originKey} and ${destKey} encountered at distance ${distance}`);
            if (!cheatsTrackingMap.get(destKey)!!.has(originKey)) {
              cheatsTrackingMap.get(destKey)!!.set(originKey, distance + 2);
            }
          }
        }

      } else {
        current = neighbor;
      }
    }
    distance++;
  }

  const cheatsThatEndHere = cheatsTrackingMap.get(toSetToken(end));
  if (cheatsThatEndHere) {
    for (const cheat of cheatsThatEndHere) {
      if (distance - cheat[1] > 0) {
        // console.log(`registering cheat from ${cheat[0]}. current distance ${distance}, distance when cheat registered ${cheat[1]}`)
        cheats[`${cheat[0]} - ${toSetToken(end)}`] = distance - cheat[1];
      }
    }
  }

  if (grid.length > 15) {
    return Object.values(cheats).filter(cheatSaved => cheatSaved >= 100).length;
  } else {
    return Object.values(cheats).filter(cheatSaved => cheatSaved >= 64).length;
  }
};

const part2 = (rawInput: string) => {
  const { start, end, grid } = parseInput(rawInput);

  let pathCoordinates: Coordinate[] = [];
  let visited = new Set<string>(toSetToken(start));
  let current: Coordinate = start;
  while (!(current.y === end.y && current.x === end.x)) {
    const currentSetToken = toSetToken(current);
    visited.add(currentSetToken);
    pathCoordinates.push(current);

    const neighbors = generateNeighbors(current, visited, grid);
    for (const neighbor of neighbors) {
      if (grid[neighbor.y][neighbor.x] !== Number.POSITIVE_INFINITY) {
        current = neighbor;
      }
    }
  }
  pathCoordinates.push(end);

  current = start;
  visited = new Set<string>(toSetToken(start));
  const cheatsTrackingMap: Map<string, Map<string, number>> = new Map();
  const cheats: Record<string, number> = {};
  let distance = 0;
  while (!(current.y === end.y && current.x === end.x)) {
    // console.log(`Visiting %o`, current);
    const currentSetToken = toSetToken(current);
    visited.add(currentSetToken);
    pathCoordinates = pathCoordinates.filter(coord => !(current.y === coord.y && current.x === coord.x));

    const cheatsThatEndHere = cheatsTrackingMap.get(currentSetToken);
    if (cheatsThatEndHere) {
      for (const cheat of cheatsThatEndHere) {
        if (distance - cheat[1] > 0) {
          // console.log(`registering cheat from ${cheat[0]} to %o. current distance ${distance}, distance when cheat registered ${cheat[1]}, saves ${distance - cheat[1]}`, current)
          cheats[`${cheat[0]} - ${currentSetToken}`] = distance - cheat[1];
        }
      }
    }

    const cheatOutputs = pathCoordinates
      .map(coord => ({ next: coord, cheatLength: manhattanDistanceCoord(coord, current)}))
      .filter(cheat => cheat.cheatLength <= 20);

    if (cheatOutputs.length > 0) {
      // console.log(`found potential cheat %o`, neighbor);
      const originKey = toSetToken(current);
      for (const cheatOutput of cheatOutputs) {
        const destKey = toSetToken(cheatOutput.next);
        if (!cheatsTrackingMap.has(destKey)) {
          cheatsTrackingMap.set(destKey, new Map());
        }

        // console.log(`cheat between ${originKey} and ${destKey} encountered at distance ${distance}`);
        if (!cheatsTrackingMap.get(destKey)!!.has(originKey)) {
          cheatsTrackingMap.get(destKey)!!.set(originKey, distance + cheatOutput.cheatLength);
        }
      }
    }

    const neighbors = generateNeighbors(current, visited, grid);
    for (const neighbor of neighbors) {
      if (grid[neighbor.y][neighbor.x] !== Number.POSITIVE_INFINITY) {
        current = neighbor;
      }
    }
    distance++;
  }

  const cheatsThatEndHere = cheatsTrackingMap.get(toSetToken(end));
  if (cheatsThatEndHere) {
    for (const cheat of cheatsThatEndHere) {
      if (distance - cheat[1] > 0) {
        // console.log(`registering cheat from ${cheat[0]}. current distance ${distance}, distance when cheat registered ${cheat[1]}`)
        cheats[`${cheat[0]} - ${toSetToken(end)}`] = distance - cheat[1];
      }
    }
  }

  const groups = Object.entries(cheats).filter(cheat => cheat[1] >= 50)
    .reduce((groups, item) => {
    const group = (groups[item[1]] || []);
    group.push(item);
    groups[item[1]] = group;
    return groups;
  }, {} as any);

  Object.entries(groups).forEach(g => {
    const foo = g[1] as string[];
    console.log(`${g[0]} - ${foo.length}`);
  });
  console.log(groups[76])

  if (grid.length > 15) {
    return Object.values(cheats).filter(cheatSaved => cheatSaved >= 100).length;
  } else {
    return Object.values(cheats).filter(cheatSaved => cheatSaved >= 50).length;
  }
};

run({
  part1: {
    tests: [
      {
        input: `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
        expected: 1,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
        expected: 285,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
