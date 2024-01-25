import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => line.split(""));

type Node = { id: number, 0: number, 1: number, neighbors: { node: Node, weight: number }[] };
type Branch = { id: number, startNode: Node, end: number[], positions: Set<string>, length: number };
type NextPos = { 0: number, 1: number, symbol: string; };
type NextPosPart2 = { 0: number, 1: number, symbol: string; direction: string; };

const generateKey = (pos: number[]) => {
  return `${pos[0]},${pos[1]}`;
}

const parseGrid = (grid: string[][]) => {
  let currentBranchId = 0;
  let currentNodeId = 0;
  const startNode: Node = { id: currentNodeId++, 0: 0, 1: 1, neighbors: [] };
  const endNode: Node = { id: currentNodeId++, 0: grid.length - 1, 1: grid[0].length - 2, neighbors: [] };
  const startKey = generateKey([0, 1]);
  const endKey = generateKey([grid.length - 1, grid[0].length - 2]);
  const startingBranch = { id: currentBranchId++, startNode: startNode, end: [0, 1], positions: new Set([startKey]), length: 0 };
  const branchesById: Record<number, Branch> = {};
  const nodes: Record<string, Node> = {};
  nodes[startKey] = startNode;
  nodes[endKey] = endNode;
  const branchesLeft: Branch[] = [startingBranch];
  branchesById[startingBranch.id] = startingBranch;

  while (branchesLeft.length > 0) {
    const branch = branchesLeft.pop()!!;
    // console.log(`Looking at branch: ${branch.id}, curr pos ${branch.end}`);

    // Walk in the one direction we can
    const validNextDirection = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
      const nextYIndex = branch.end[0] + (candidateModifiers[0] as number);
      const nextXIndex = branch.end[1] + (candidateModifiers[1] as number);
      if (nextXIndex < 0 || nextYIndex < 0 || nextYIndex === grid.length || nextXIndex === grid[0].length) {
        return;
      }

      const nextSymbol = grid[nextYIndex][nextXIndex];
      if (nextSymbol === "#") {
        return;
      }

      if (branch.positions.has(generateKey([nextYIndex, nextXIndex]))) {
        return;
      }

      // Don't walk back onto the node
      if (branch.startNode[0] === nextYIndex && branch.startNode[1] === nextXIndex) {
        return;
      }

      return { 0: nextYIndex, 1: nextXIndex, symbol: nextSymbol };
    }).filter(possibleNext => possibleNext !== undefined) as unknown as NextPos[];

    // If we have nowhere else to go we're at the end
    let branchEndNode: Node;
    let wasNewNode = false;
    const nextDirection = validNextDirection[0];
    if (nextDirection[0] === endNode[0] && nextDirection[1] === endNode[1]) {
      branchEndNode = endNode;
    } else {
      // Add the next spot to our branch
      const currKey = generateKey([nextDirection[0], nextDirection[1]]);
      branch.end = [nextDirection[0], nextDirection[1]];
      branch.positions.add(currKey);
      branch.length++;

      // Then check it. If it's a clear path, keep trucking...
      let nodePosition: number[];
      if (nextDirection.symbol === ".") {
        branchesLeft.push(branch);
        continue;
      } else {
        // Otherwise find the actual junction and check if there's a node for it...
        if (nextDirection.symbol === ">") {
          nodePosition = [nextDirection[0], nextDirection[1] + 1];
        } else if (nextDirection.symbol === "<") {
          nodePosition = [nextDirection[0], nextDirection[1] - 1];
        } else if (nextDirection.symbol === "v") {
          nodePosition = [nextDirection[0] + 1, nextDirection[1]];
        } else if (nextDirection.symbol === "^") {
          nodePosition = [nextDirection[0] - 1, nextDirection[1]];
        } else {
          throw Error("WHOOPS, universe is broken");
        }
      }

      const branchEndKey = generateKey(nodePosition);
      branchEndNode = nodes[branchEndKey];
      // ... if there's not, create one...
      if (!branchEndNode) {
        branchEndNode = { id: currentNodeId++, 0: nodePosition[0], 1: nodePosition[1], neighbors: [] };
        nodes[branchEndKey] = branchEndNode;
        wasNewNode = true;
      }
    }

    // ... then connect the nodes...
    branch.startNode.neighbors.push({ node: branchEndNode, weight: branch.length });
    // branchEndNode.neighbors.push({ node: branch.startNode, weight: branch.length });

    // ... then make new branches for the NEW paths from the junction, IF it was a new node.
    if (wasNewNode) {
      const possibleNextBranches = [[-1, 0, "N"], [1, 0, "S"], [0, -1, "W"], [0, 1, "E"]].map(candidateModifiers => {
        const nextYIndex = branchEndNode[0] + (candidateModifiers[0] as number);
        const nextXIndex = branchEndNode[1] + (candidateModifiers[1] as number);
        const nextDirection = (candidateModifiers[2] as string);
        if (nextXIndex < 0 || nextYIndex < 0 || nextYIndex === grid.length || nextXIndex === grid[0].length) {
          return;
        }

        const nextSymbol = grid[nextYIndex][nextXIndex];
        if (nextSymbol === "#") {
          return;
        } else if (nextSymbol === ">" && nextDirection !== "E") {
          return;
        } else if (nextSymbol === "<" && nextDirection !== "W") {
          return;
        } else if (nextSymbol === "^" && nextDirection !== "N") {
          return;
        } else if (nextSymbol === "v" && nextDirection !== "S") {
          return;
        }

        return { 0: nextYIndex, 1: nextXIndex, symbol: nextSymbol };
      }).filter(possibleNext => possibleNext !== undefined) as unknown as NextPos[]

      // console.log(possibleNextBranches);

      branchesLeft.push(...possibleNextBranches.map(nextBranch => {
        const branch = {
          id: currentBranchId++,
          startNode: branchEndNode,
          end: [nextBranch[0], nextBranch[1]],
          length: 1,
          positions: new Set([generateKey([nextBranch[0], nextBranch[1]])])
        };
        // console.log(branch);
        branchesById[branch.id] = branch;
        return branch;
      }));
    }
  }

  return nodes;
};

const getTotalDistancesFromNode = (node: Node): number[] =>  {
  if (node.neighbors.length === 0) {
    return [1];
  } else {
    return node.neighbors.map(neighbor => {
      return getTotalDistancesFromNode(neighbor.node).map(dist => 1 + neighbor.weight + dist);
    }).flat();
  }
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const nodes = parseGrid(grid);
  const start = nodes[generateKey([0, 1])];

  return Math.max(...getTotalDistancesFromNode(start).map(length => length - 1));
};

const parseGridPart2 = (grid: string[][]) => {
  let currentBranchId = 0;
  let currentNodeId = 0;
  const startNode: Node = { id: currentNodeId++, 0: 0, 1: 1, neighbors: [] };
  const endNode: Node = { id: currentNodeId++, 0: grid.length - 1, 1: grid[0].length - 2, neighbors: [] };
  const startKey = generateKey([0, 1]);
  const endKey = generateKey([grid.length - 1, grid[0].length - 2]);
  const startingBranch = { id: currentBranchId++, startNode: startNode, end: [0, 1], positions: new Set([startKey]), length: 0 };
  const branchesById: Record<number, Branch> = {};
  const nodes: Record<string, Node> = {};
  nodes[startKey] = startNode;
  nodes[endKey] = endNode;
  const branchesLeft: Branch[] = [startingBranch];
  branchesById[startingBranch.id] = startingBranch;

  while (branchesLeft.length > 0) {
    const branch = branchesLeft.pop()!!;
    // console.log(`Looking at branch: ${branch.id}, curr pos ${branch.end}`);

    // Walk in the one direction we can
    const validNextDirection = [[-1, 0, "N"], [1, 0, "S"], [0, -1, "W"], [0, 1, "E"]].map(candidateModifiers => {
      const nextYIndex = branch.end[0] + (candidateModifiers[0] as number);
      const nextXIndex = branch.end[1] + (candidateModifiers[1] as number);
      const nextDirection = (candidateModifiers[2] as string);
      if (nextXIndex < 0 || nextYIndex < 0 || nextYIndex === grid.length || nextXIndex === grid[0].length) {
        return;
      }

      const nextSymbol = grid[nextYIndex][nextXIndex];
      if (nextSymbol === "#") {
        return;
      }

      if (branch.positions.has(generateKey([nextYIndex, nextXIndex]))) {
        return;
      }

      // Don't walk back onto the node
      if (branch.startNode[0] === nextYIndex && branch.startNode[1] === nextXIndex) {
        return;
      }

      const result: NextPosPart2 = { 0: nextYIndex, 1: nextXIndex, symbol: nextSymbol, direction: nextDirection };
      return result;
    }).filter(possibleNext => possibleNext !== undefined) as unknown as NextPosPart2[];

    // If we have nowhere else to go we're at the end
    let branchEndNode: Node;
    let wasNewNode = false;
    const nextDirection = validNextDirection[0];
    if (nextDirection[0] === endNode[0] && nextDirection[1] === endNode[1]) {
      branchEndNode = endNode;
    } else {
      // Add the next spot to our branch
      const currKey = generateKey([nextDirection[0], nextDirection[1]]);
      branch.end = [nextDirection[0], nextDirection[1]];
      branch.positions.add(currKey);
      branch.length++;

      // Then check it. If it's a clear path, keep trucking...
      let nodePosition: number[];
      if (nextDirection.symbol === ".") {
        branchesLeft.push(branch);
        continue;
      } else {
        // Otherwise find the actual junction and check if there's a node for it...
        if (nextDirection.direction === "E") {
          nodePosition = [nextDirection[0], nextDirection[1] + 1];
        } else if (nextDirection.direction === "W") {
          nodePosition = [nextDirection[0], nextDirection[1] - 1];
        } else if (nextDirection.direction === "S") {
          nodePosition = [nextDirection[0] + 1, nextDirection[1]];
        } else if (nextDirection.direction === "N") {
          nodePosition = [nextDirection[0] - 1, nextDirection[1]];
        } else {
          throw Error("WHOOPS, universe is broken");
        }
      }

      const branchEndKey = generateKey(nodePosition);
      branchEndNode = nodes[branchEndKey];
      // ... if there's not, create one...
      if (!branchEndNode) {
        branchEndNode = { id: currentNodeId++, 0: nodePosition[0], 1: nodePosition[1], neighbors: [] };
        nodes[branchEndKey] = branchEndNode;
        wasNewNode = true;
      }
    }

    // ... then connect the nodes...
    if (branch.startNode.neighbors.findIndex(neighbor => neighbor.node.id === branchEndNode.id) === -1) {
      branch.startNode.neighbors.push({node: branchEndNode, weight: branch.length});
    }
    if (branchEndNode.neighbors.findIndex(neighbor => neighbor.node.id === branch.startNode.id) === -1) {
      branchEndNode.neighbors.push({node: branch.startNode, weight: branch.length});
    }

    // ... then make new branches for the NEW paths from the junction, IF it was a new node.
    if (wasNewNode) {
      const possibleNextBranches = [[-1, 0, "N"], [1, 0, "S"], [0, -1, "W"], [0, 1, "E"]].map(candidateModifiers => {
        const nextYIndex = branchEndNode[0] + (candidateModifiers[0] as number);
        const nextXIndex = branchEndNode[1] + (candidateModifiers[1] as number);
        if (nextXIndex < 0 || nextYIndex < 0 || nextYIndex === grid.length || nextXIndex === grid[0].length) {
          return;
        }

        // DON'T go back to the branch we just came from
        if (nextYIndex === branch.end[0] && nextXIndex === branch.end[1]) {
          return;
        }

        const nextSymbol = grid[nextYIndex][nextXIndex];
        if (nextSymbol === "#") {
          return;
        }

        return { 0: nextYIndex, 1: nextXIndex, symbol: nextSymbol };
      }).filter(possibleNext => possibleNext !== undefined) as unknown as NextPos[]

      // console.log(possibleNextBranches);

      branchesLeft.push(...possibleNextBranches.map(nextBranch => {
        const branch = {
          id: currentBranchId++,
          startNode: branchEndNode,
          end: [nextBranch[0], nextBranch[1]],
          length: 1,
          positions: new Set([generateKey([nextBranch[0], nextBranch[1]])])
        };
        // console.log(branch);
        branchesById[branch.id] = branch;
        return branch;
      }));
    }
  }

  return nodes;
};

const getTotalDistancesFromNodePart2 = (node: Node, visited: number[], endNodeId: number): number[] =>  {
  // console.log(`Looking at ${node.id}, have visited ${visited}`)
  visited = [...visited, node.id];

  const pathLengths = new Set<number>();
  const filteredNeighbors = node.neighbors
      .filter(neighbor => !visited.includes(neighbor.node.id));
  for (const neighbor of filteredNeighbors) {
    if (neighbor.node.id === endNodeId) {
      pathLengths.add(1 + neighbor.weight);
    }

    // console.log(`Looking at neighbor ${neighbor.node.id} with weight ${neighbor.weight}`);
    const neighborPathLengths = getTotalDistancesFromNodePart2(neighbor.node, visited, endNodeId).map(dist => 1 + neighbor.weight + dist);
    for (const neighborPathLength of neighborPathLengths) {
      pathLengths.add(neighborPathLength);
    }
  }
  return Array.from(pathLengths);
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const nodes = parseGridPart2(grid);
  const start = nodes[generateKey([0, 1])];
  const end = nodes[generateKey([grid.length - 1, grid[0].length - 2])];
  const secondToEnd = end.neighbors[0].node;
  const costToEndFromSecondToEnd = end.neighbors[0].weight + 1;

  const lengths = getTotalDistancesFromNodePart2(start, [], secondToEnd.id);
  // console.log(lengths);

  // 5874 too low.
  return Math.max(...lengths) + costToEndFromSecondToEnd;
};

run({
  part1: {
    tests: [
      {
        input: `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
        expected: 94,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
        expected: 154,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
