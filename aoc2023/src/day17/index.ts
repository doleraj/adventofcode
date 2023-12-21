import run from "aocrunner";
import "../utils/index.js";
import {priorityQueue, PriorityQueue} from "../utils/data-structures.js";

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => line.split("").map(char => Number.parseInt(char)));

type CityNode = { 0: number, 1: number, weight: number, pathToArrive: string[], };

const generateKey = (node: CityNode) => {
  return JSON.stringify(node);
}

const generateNeighborsPt1 = (position: CityNode, grid: number[][]): CityNode[] => {
  // I am committing crimes here
  return [[-1, 0, "N"], [1, 0, "S"], [0, -1, "W"], [0, 1, "E"]].map(candidateModifiers => {
    const nextYIndex = position[0] + (candidateModifiers[0] as number);
    const nextXIndex = position[1] + (candidateModifiers[1] as number);
    const nextDirection = (candidateModifiers[2] as string);
    if (nextXIndex < 0 || nextYIndex < 0 || nextYIndex === grid.length || nextXIndex === grid[0].length) {
      return null;
    }

    if (position.pathToArrive.length === 3 && position.pathToArrive[0] === nextDirection && position.pathToArrive[1] === nextDirection && position.pathToArrive[2] === nextDirection) {
      // console.log(`Not generating path to the ${nextDirection} because previous path was ${JSON.stringify(position.pathToArrive)}`)
      return null;
    }
    const mostRecentDirection = position.pathToArrive[position.pathToArrive.length - 1];
    if ((mostRecentDirection === "E" && nextDirection === "W") || (mostRecentDirection === "N" && nextDirection === "S")
      || (mostRecentDirection === "W" && nextDirection === "E") || (mostRecentDirection === "S" && nextDirection === "N")) {
      return null;
    }

    const nextNodePath = position.pathToArrive.length === 3 ? position.pathToArrive.slice(1) : [...position.pathToArrive];
    // If we're not going the same way just get rid of the array
    if (position.pathToArrive[position.pathToArrive.length - 1] !== nextDirection) {
      nextNodePath.splice(0, position.pathToArrive.length);
    }
    nextNodePath.push(nextDirection);
    const nextNode: CityNode = { 0: nextYIndex, 1: nextXIndex, weight: grid[nextYIndex][nextXIndex], pathToArrive: nextNodePath };
    // console.log(`Adding city node: ${JSON.stringify(nextNode)}`);
    return nextNode;
  }).filter((v): v is CityNode => v !== null);
}

const manhattanDistance = (location: CityNode, end: number[]): number => {
  return Math.abs(location[0] - end[0]) + Math.abs(location[1] - end[1]);
}

function calculatePath(currentNode: CityNode, parents: Map<string, CityNode>) {
  const path: CityNode[] = [];

  let workingNode = currentNode;
  while (parents.has(generateKey(workingNode))) {
    path.push(workingNode);
    workingNode = parents.get(generateKey(workingNode))!!;
  }
  return path;
}

const getCostForNode = (node: CityNode, costMap: Record<string, number>) => {
  let fetchedCost = costMap[generateKey(node)];
  if (fetchedCost === undefined) {
    fetchedCost = Number.POSITIVE_INFINITY;
  }
  return fetchedCost;
}

function checkNeighbors(neighbors: CityNode[], costs: Record<string, number>, currentNode: CityNode, parents: Map<string, CityNode>, distanceCosts: Record<string, number>, end: number[], openList: PriorityQueue<CityNode>) {
  for (let neighbor of neighbors) {
    const tentativeCost = getCostForNode(currentNode, costs) + currentNode.weight;
    if (tentativeCost < getCostForNode(neighbor, costs)) {
      parents.set(generateKey(neighbor), currentNode);
      costs[generateKey(neighbor)] = tentativeCost;
      distanceCosts[generateKey(neighbor)] = costs[generateKey(neighbor)] + manhattanDistance(neighbor, end);

      openList.insert(neighbor, getCostForNode(neighbor, distanceCosts));
    }
  }
}

function runAStar(grid: number[][], start: CityNode, end: number[], generateNeighbors: (position: CityNode, grid: number[][]) => CityNode[], isDone: (node: CityNode) => boolean) {
  const openList: PriorityQueue<CityNode> = priorityQueue();
  const costs: Record<string, number> = {};
  const distanceCosts: Record<string, number> = {};
  const parents = new Map<string, CityNode>();
  costs[generateKey(start)] = 0;
  distanceCosts[generateKey(start)] = manhattanDistance(start, end);
  openList.insert(start, getCostForNode(start, distanceCosts));

  let cycle = 0;
  while (!openList.isEmpty()) {
    const currentNode = openList.pop()!!;

    if (isDone(currentNode)) {
      // console.log(Array.from(parents.values()).find(value => value[0] === 0 && value[1] === 1));
      return calculatePath(currentNode, parents);
    }

    const neighbors = generateNeighbors(currentNode, grid);
    checkNeighbors(neighbors, costs, currentNode, parents, distanceCosts, end, openList);
    // if (cycle++ % 10000 === 0) {
    //   console.log(`After ${cycle} cycles, openList has ${openList.size()} entries.`);
    // }
  }

  return [];
}

const printGrid = (grid: number[][], path: CityNode[]) => {
  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[0].length; x++) {
      if (path.findIndex(n => n[0] === y && n[1] === x) > -1) {
        line += "*";
      } else {
        line += grid[y][x];
      }
    }
    console.log(line);
  }
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const end = [grid.length - 1, grid[0].length - 1];
  const isDone = (currentNode: CityNode) => currentNode[0] === end[0] && currentNode[1] === end[1];
  const path = runAStar(grid, { 0:0, 1:0, weight: 0, pathToArrive: [] }, end, generateNeighborsPt1, isDone);

  // printGrid(grid, path);
  // console.log(path);
  return path.reduce((accum, node) => accum + node.weight, 0);
};

const generateNeighborsPt2 = (position: CityNode, grid: number[][]): CityNode[] => {
  // I am committing crimes here
  return [[-1, 0, "N"], [1, 0, "S"], [0, -1, "W"], [0, 1, "E"]].map(candidateModifiers => {
    const nextYIndex = position[0] + (candidateModifiers[0] as number);
    const nextXIndex = position[1] + (candidateModifiers[1] as number);
    const nextDirection = (candidateModifiers[2] as string);
    if (nextXIndex < 0 || nextYIndex < 0 || nextYIndex === grid.length || nextXIndex === grid[0].length) {
      return null;
    }

    if (position.pathToArrive.length === 10 && position.pathToArrive.every(path => path === nextDirection)) {
      // console.log(`Not generating path to the ${nextDirection} because previous path was ${JSON.stringify(position.pathToArrive)}`)
      return null;
    }

    const mostRecentDirection = position.pathToArrive[position.pathToArrive.length - 1];
    if (position.pathToArrive.length < 4 && mostRecentDirection !== undefined && nextDirection !== mostRecentDirection) {
      // console.log(`Not going direction ${nextDirection} because we need to head ${mostRecentDirection}`);
      return null;
    }

    if ((mostRecentDirection === "E" && nextDirection === "W") || (mostRecentDirection === "N" && nextDirection === "S")
        || (mostRecentDirection === "W" && nextDirection === "E") || (mostRecentDirection === "S" && nextDirection === "N")) {
      return null;
    }

    const nextNodePath = position.pathToArrive.length === 10 ? position.pathToArrive.slice(1) : [...position.pathToArrive];
    // If we're not going the same way just get rid of the array
    if (position.pathToArrive[position.pathToArrive.length - 1] !== nextDirection) {
      nextNodePath.splice(0, position.pathToArrive.length);
    }
    nextNodePath.push(nextDirection);
    const nextNode: CityNode = { 0: nextYIndex, 1: nextXIndex, weight: grid[nextYIndex][nextXIndex], pathToArrive: nextNodePath };
    // console.log(`Adding city node: ${JSON.stringify(nextNode)}`);
    return nextNode;
  }).filter((v): v is CityNode => v !== null);
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const end = [grid.length - 1, grid[0].length - 1];
  const isDone = (currentNode: CityNode) => {
    if (currentNode.pathToArrive.length < 4 || !currentNode.pathToArrive.every((path, _, array) => path === array[0])) {
      return false;
    }

    return currentNode[0] === end[0] && currentNode[1] === end[1];
  }
  const path = runAStar(grid, { 0:0, 1:0, weight: 0, pathToArrive: [] }, end, generateNeighborsPt2, isDone);

  // printGrid(grid, path);
  // console.log(path);
  return path.reduce((accum, node) => accum + node.weight, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 94,
      },
      {
        input: `
111111111111
999999999991
999999999991
999999999991
999999999991`,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
