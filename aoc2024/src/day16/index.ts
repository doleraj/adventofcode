import run from "aocrunner";
import {
  DijkstrasAPCoordinate,
  DijkstrasCoordinate,
  runAllPathDijkstras,
  runDijkstras,
} from "../utils/index.js";

const parseInput = (rawInput: string) => {
  let start: number[] = [];
  let end: number[] = [];
  const grid = rawInput.split("\n").map((line, y) => {
    return line.split("").map((cell, x) => {
      if (cell === "S") {
        start = [y, x];
        return 1;
      } else if (cell === "E") {
        end = [y, x];
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

const generateNeighbors = (currentNode: DijkstrasCoordinate, grid: number[][]) => {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
    const nextYIndex = currentNode.y + candidateModifiers[0];
    const nextXIndex = currentNode.x + candidateModifiers[1];
    if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
      return null;
    }

    // console.log(`Navigating to [${nextYIndex}, ${nextXIndex}]`);
    const nextVal = grid[nextYIndex][nextXIndex];
    // console.log(`Last node is %o`, lastNode);
    const isTurn = currentNode.previousNode ? currentNode.previousNode.y !== nextYIndex && currentNode.previousNode.x !== nextXIndex : false;
    const nextDistance = currentNode.distance + (isTurn ? 1000 + nextVal : nextVal);
    // console.log(`Updating [${nextYIndex}, ${nextXIndex}] to ${nextDistance}`)
    return { y: nextYIndex, x: nextXIndex, distance: nextDistance, previousNode: currentNode };
  }).filter(val => val != null) as DijkstrasCoordinate[];
}

const generateNeighbors2 = (currentNode: DijkstrasAPCoordinate, grid: number[][]) => {
  const possibleModifiers = [];
  if (currentNode.orientation === "N") {
    possibleModifiers.push([-1, 0, "N"], [0, 0, "E"], [0, 0, "W"]);
  } else if (currentNode.orientation === "E") {
    possibleModifiers.push([0, 1, "E"], [0, 0, "N"], [0, 0, "S"]);
  } else if (currentNode.orientation === "S") {
    possibleModifiers.push([1, 0, "S"], [0, 0, "E"], [0, 0, "W"]);
  } else if (currentNode.orientation === "W") {
    possibleModifiers.push([0, -1, "W"], [0, 0, "N"], [0, 0, "S"]);
  }

  return possibleModifiers.map(candidateModifiers => {
    const nextYIndex = currentNode.y + (candidateModifiers[0] as number);
    const nextXIndex = currentNode.x + (candidateModifiers[1] as number);
    const nextOrientation = candidateModifiers[2] as string;
    if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
      return null;
    }

    // console.log(`Navigating to [${nextYIndex}, ${nextXIndex}]`);
    const nextVal = grid[nextYIndex][nextXIndex];
    if (nextVal === Number.POSITIVE_INFINITY) {
      return null;
    }
    // console.log(`Last node is %o`, lastNode);
    const isTurn = currentNode.orientation !== nextOrientation;
    const nextDistance = currentNode.distance + (isTurn ? 1000 : nextVal);
    // console.log(`Updating [${nextYIndex}, ${nextXIndex}] to ${nextDistance}`)
    return { y: nextYIndex, x: nextXIndex, distance: nextDistance, orientation: nextOrientation, previousNodes: [currentNode] };
  }).filter(val => val != null) as DijkstrasAPCoordinate[];
}

const part1 = (rawInput: string) => {
  const { start, end, grid } = parseInput(rawInput);

  return runDijkstras(grid, start, end, generateNeighbors);
};


const part2 = (rawInput: string) => {
  const { start, end, grid } = parseInput(rawInput);

  return runAllPathDijkstras(grid, start, end, generateNeighbors2);
};

run({
  part1: {
    tests: [
      {
        input: `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 7036,
      },
      {
        input: `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 11048,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 45,
      },
      {
        input: `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
