import run from "aocrunner";

const parseInput = (rawInput: string) => {
  let start: number[] = [0, 0];
  const alternateStarts: number[][] = [];
  let end: number[] = [0, 0];
  const grid = rawInput.split("\n").map((line, vIndex) => {
    return line.split("").map((cell, hIndex) => {
      if (cell === "S") {
        start = [vIndex, hIndex];
        alternateStarts.push(start);
        return "a".charCodeAt(0);
      } else if (cell === "E") {
        end = [vIndex, hIndex];
        return "z".charCodeAt(0);
      } else if (cell === "a") {
        alternateStarts.push([vIndex, hIndex]);
      }

      return cell.charCodeAt(0);
    });
  })

  return { grid, start, end, alternateStarts };
}

const generateNeighbors = (position: number[], currentVal: number, grid: number[][]): number[][] => {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
    const nextXIndex = position[0] + candidateModifiers[0];
    const nextYIndex = position[1] + candidateModifiers[1];
    if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
      return null;
    }

    const nextPosition = [nextXIndex, nextYIndex];

    const nextVal = grid[nextPosition[0]][nextPosition[1]];
    if (nextVal <= currentVal + 1) {
      return nextPosition;
    } else {
      return null;
    }
  }).filter((v): v is number[] => v !== null);
}

const manhattanDistance = (location: number[], end: number[]): number => {
  return Math.abs(location[0] - end[0]) + Math.abs(location[1] - end[1]);
}

function calculatePathLength(currentNode: number[], parents: Map<string, number[]>) {
  const path = [];

  let tempNode = currentNode;
  while (parents.has(tempNode.toString())) {
    path.push(tempNode.toString());
    tempNode = parents.get(tempNode.toString())!!;
  }
  return path.length;
}

function checkNeighbors(neighbors: number[][], costs: number[][], currentNode: number[], parents: Map<string, number[]>, distanceCosts: number[][], end: number[], openList: number[][]) {
  for (let neighbor of neighbors) {
    const tentativeCost = costs[currentNode[0]][currentNode[1]] + 1;
    if (tentativeCost < costs[neighbor[0]][neighbor[1]]) {
      parents.set(neighbor.toString(), currentNode);
      costs[neighbor[0]][neighbor[1]] = tentativeCost;
      distanceCosts[neighbor[0]][neighbor[1]] = costs[neighbor[0]][neighbor[1]] + manhattanDistance(neighbor, end);

      openList.push(neighbor);
    }
  }
}

function runAStar(grid: number[][], start: number[], end: number[]) {
  const openList: number[][] = [];
  const costs = grid.map(line => line.map(_ => Number.POSITIVE_INFINITY));
  const distanceCosts = grid.map(line => line.map(_ => Number.POSITIVE_INFINITY));
  const parents = new Map<string, number[]>();
  costs[start[0]][start[1]] = 0;
  distanceCosts[start[0]][start[1]] = manhattanDistance(start, end);
  openList.push(start);

  while (openList.length > 0) {
    openList.sort((a, b) => distanceCosts[b[0]][b[1]] - distanceCosts[a[0]][a[1]]);
    const currentNode = openList.pop()!!;

    if (currentNode.toString() === end.toString()) {
      return calculatePathLength(currentNode, parents);
    }

    const neighbors = generateNeighbors(currentNode, grid[currentNode[0]][currentNode[1]], grid);
    checkNeighbors(neighbors, costs, currentNode, parents, distanceCosts, end, openList);
  }

  return -1;
}

const part1 = (rawInput: string) => {
  const { grid, start, end } = parseInput(rawInput);

  return runAStar(grid, start, end);
};

const part2 = (rawInput: string) => {
  const { grid, alternateStarts, end } = parseInput(rawInput);
  const pathLengths = alternateStarts.map(start => {
    return runAStar(grid, start, end);
  })
    .filter(length => length > 0)
    .sort((a, b) => a - b);

  return pathLengths[0];
};


run({
  part1: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
