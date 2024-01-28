import run from "aocrunner";
import "../utils/index.js";

type Node = { id: string, neighbors: string[], neighborWeights: Record<string, number> };
type Cut = { s: string, t: string, cutWeight: number };

const getOrCreateNode = (nodeId: string, nodes: Record<string, Node>) => {
  const trimmedId = nodeId.trim();
  let node = nodes[trimmedId];
  if (!node) {
    node = { id: trimmedId, neighbors: [], neighborWeights: {} };
    nodes[trimmedId] = node;
  }
  return node;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const nodes: Record<string, Node> = {};

  lines.forEach(line => {
    const parts = line.split(":");
    const leftNode = getOrCreateNode(parts[0].trim(), nodes);

    const connectedNodes = parts[1].trim().split(" ").map(nodeId => {
      return getOrCreateNode(nodeId, nodes);
    });

    connectedNodes.forEach(connectedNode => {
      leftNode.neighbors.push(connectedNode.id);
      leftNode.neighborWeights[connectedNode.id] = 1;
      connectedNode.neighbors.push(leftNode.id);
      connectedNode.neighborWeights[leftNode.id] = 1;
    });
  });

  return nodes;
}

const minimumCutPhase = (nodes: Record<string, Node>): Cut => {
  const candidates = Object.values(nodes).map(n => n.id);
  const cutWeights: number[] = [];
  const startId = candidates.splice(0, 1)[0];
  const foundSet = [startId];

  while (candidates.length !== 0) {
    let maxNextVertexId: string | undefined = undefined;
    let maxWeight = Number.MIN_VALUE;
    for (const candidateId of candidates) {
      const candidate = nodes[candidateId];
      let weightSum = 0;
      for (const foundNodeId of foundSet) {
        if (candidate.neighbors.includes(foundNodeId)) {
          weightSum += candidate.neighborWeights[foundNodeId];
        }
      }

      if (weightSum > maxWeight) {
        maxNextVertexId = candidateId;
        maxWeight = weightSum;
      }
    }

    if (maxNextVertexId === undefined) {
      throw new Error("Welp couldn't find a thing");
    }

    const indexOfMaxNextVertex = candidates.indexOf(maxNextVertexId);
    candidates.splice(indexOfMaxNextVertex, 1);
    foundSet.push(maxNextVertexId);
    cutWeights.push(maxWeight);
  }

  return {
    s: foundSet[foundSet.length - 2],
    t: foundSet[foundSet.length - 1],
    cutWeight: cutWeights[cutWeights.length - 1]
  };
};

const mergeNodes = (nodes: Record<string, Node>, sId: string, tId: string) => {
  const t = nodes[tId];
  const s = nodes[sId];

  const combinedNeighbors = [...s.neighbors].filter(nId => nId !== tId);
  const combinedWeights = {...s.neighborWeights};
  delete combinedWeights[tId];
  for (const neighborId of t.neighbors) {
    if (neighborId !== sId) {
      if (!combinedNeighbors.includes(neighborId)) {
        combinedNeighbors.push(neighborId);
        combinedWeights[neighborId] = t.neighborWeights[neighborId];
      } else {
        combinedWeights[neighborId] += t.neighborWeights[neighborId];
      }
    }
  }

  const combinedId = `${sId}-${tId}`;
  const combinedNode: Node = { id: combinedId, neighbors: combinedNeighbors, neighborWeights: combinedWeights } ;

  delete nodes[tId];
  delete nodes[sId];

  for (const node of Object.values(nodes)) {
    const indexOfTNode = node.neighbors.findIndex(n => n === tId);
    if (indexOfTNode !== -1) {
     node.neighbors.splice(indexOfTNode, 1);
     delete node.neighborWeights[indexOfTNode];
    }

    const indexOfSNode = node.neighbors.findIndex(n => n === sId);
    if (indexOfSNode !== -1) {
      node.neighbors.splice(indexOfSNode, 1);
      delete node.neighborWeights[indexOfSNode];
    }

    if (indexOfSNode !== -1 || indexOfTNode !== -1) {
      node.neighbors.push(combinedId);
      node.neighborWeights[combinedId] = combinedWeights[node.id];
    }
  }

  nodes[combinedId] = combinedNode;
}

const part1 = (rawInput: string) => {
  const nodes = parseInput(rawInput);
  const workingNodes = { ...nodes };

  const currentPartition: string[] = [];
  let currentBestPartition: string | undefined = undefined;
  let currentBestCut: Cut | undefined = undefined;
  let lastTime = Date.now();
  while (Object.values(workingNodes).length > 1) {
    // console.log(Object.values(workingNodes).length);
    const cutForPhase = minimumCutPhase(workingNodes);
    // console.log(cutForPhase);
    // console.log(`Minimum cut phase took ${(Date.now() - lastTime) / 1000} s`);
    // lastTime = Date.now();
    if (currentBestCut === undefined || cutForPhase.cutWeight < currentBestCut.cutWeight) {
      currentBestCut = cutForPhase;
      currentBestPartition = cutForPhase.t;
    }

    currentPartition.push(cutForPhase.t);
    mergeNodes(workingNodes, cutForPhase.s, cutForPhase.t);
    // console.log(`Merge phase took ${(Date.now() - lastTime) / 1000} s`);
    // lastTime = Date.now();
    // console.log(nodes);

    if (Object.values(workingNodes).length % 10 === 0) {
      console.log(`Working nodes has ${Object.values(workingNodes).length} nodes, ${(Date.now() - lastTime) / 1000} seconds elapsed since last message`);
      lastTime = Date.now();
    }
  }

  const sizeOfCutPartition = currentBestPartition!!.split('-').length;
  const sizeOfOtherPartition = Object.values(nodes).length - sizeOfCutPartition;

  // 519270 too low
  // 547410 too high
  return sizeOfCutPartition * sizeOfOtherPartition;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`,
        expected: 54,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
