import { priorityQueue } from "./index.js";

export type Orientation = "N" | "E" | "S" | "W";
export type DijkstrasCoordinate = { y: number; x: number; distance: number; previousNode?: DijkstrasCoordinate };
export type DijkstrasAPCoordinate = { y: number; x: number; distance: number; orientation: Orientation; previousNodes: DijkstrasAPCoordinate[] };

export const toSetToken = (thing: { y: number, x: number }): string => `[${thing.y},${thing.x}]`;
export const toSetToken3d = (thing: { z: number, y: number, x: number }): string => `[${thing.z},${thing.y},${thing.x}]`;
export const toAPSetToken = (thing: { y: number, x: number, orientation: Orientation }): string =>
  `[${thing.y},${thing.x},${thing.orientation}]`;

export const basicGenerateNeighbors = (currentNode: DijkstrasCoordinate, grid: number[][]) => {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
    const nextYIndex = currentNode.y + candidateModifiers[0];
    const nextXIndex = currentNode.x + candidateModifiers[1];
    if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
      return null;
    }

    // console.log(`Navigating to [${nextYIndex}, ${nextXIndex}]`);
    const nextVal = grid[nextYIndex][nextXIndex];
    const nextDistance = currentNode.distance + nextVal;
    // console.log(`Updating [${nextYIndex}, ${nextXIndex}] to ${nextDistance}`)
    return { y: nextYIndex, x: nextXIndex, distance: nextDistance, previousNode: currentNode };
  }).filter(val => val != null) as DijkstrasCoordinate[];
}


export const runDijkstras = (grid: number[][], start: number[], end: number[],
    generateNeighbors: (currentNode: DijkstrasCoordinate, grid: number[][]) => DijkstrasCoordinate[]): number => {

  const startNode: DijkstrasCoordinate = { y: start[0], x: start[1], distance: 0, previousNode: { y: start[0], x: start[1] - 1, distance: 0 } };

  let nodesToVisit = priorityQueue<DijkstrasCoordinate>();
  nodesToVisit.insert(startNode, 0);
  const visited: string[] = [];
  const visitedNodes: DijkstrasCoordinate[] = [];
  while (!nodesToVisit.isEmpty()) {
    const nextNode = nodesToVisit.pop()!!;
    if (visited.includes(toSetToken(nextNode))) {
      continue;
    }

    visited.push(toSetToken(nextNode));
    visitedNodes.push(nextNode);
    generateNeighbors(nextNode, grid).forEach(neighbor => {
      nodesToVisit.insert(neighbor, neighbor.distance);
    });
  }

  const endNodes = visitedNodes.filter(node => node.y === end[0] && node.x === end[1]);
  return endNodes.map(node => node.distance).sort((a, b) => a - b)[0];
}

const visitBackNode = (node: DijkstrasAPCoordinate, allVisitedNodesWithOrientations: Set<string>, allVisitedNodes: Set<string>) => {
  const id = toAPSetToken(node);
  if (allVisitedNodesWithOrientations.has(id)) {
    return;
  }

  allVisitedNodesWithOrientations.add(id);
  allVisitedNodes.add(toSetToken(node));

  node.previousNodes.forEach((next) => {
    visitBackNode(next, allVisitedNodesWithOrientations, allVisitedNodes);
  })
}

export const runAllPathDijkstras = (grid: number[][], start: number[], end: number[],
                             generateNeighbors: (currentNode: DijkstrasAPCoordinate, grid: number[][]) => DijkstrasAPCoordinate[]): number => {

  const startNode: DijkstrasAPCoordinate = { y: start[0], x: start[1], distance: 0, orientation: "E", previousNodes: [] };

  let nodesToVisit = priorityQueue<DijkstrasAPCoordinate>();
  nodesToVisit.insert(startNode, 0);
  const visited: string[] = [];
  const visitedNodes: DijkstrasAPCoordinate[] = [];
  while (!nodesToVisit.isEmpty()) {
    const nextNode = nodesToVisit.pop()!!;
    if (visited.includes(toAPSetToken(nextNode))) {
      const oldNode = visitedNodes.find(node =>
        node.y === nextNode.y && node.x === nextNode.x && node.orientation === nextNode.orientation)!!;

      if (nextNode.distance <= oldNode.distance) {
        oldNode.previousNodes.push(...nextNode.previousNodes);
      }
      continue;
    }

    visited.push(toAPSetToken(nextNode));
    visitedNodes.push(nextNode);
    generateNeighbors(nextNode, grid).forEach(neighbor => {
      nodesToVisit.insert(neighbor, neighbor.distance);
    });
  }

  const endNodes = visitedNodes.filter(node => node.y === end[0] && node.x === end[1]);
  let endNode : DijkstrasAPCoordinate = endNodes[0];
  const allVisitedNodesWithOrientations = new Set<string>();
  const allVisitedNodes = new Set<string>();
  visitBackNode(endNode, allVisitedNodesWithOrientations, allVisitedNodes);

  return allVisitedNodes.size;
}
