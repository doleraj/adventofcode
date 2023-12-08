import run from "aocrunner";
import "../utils/index.js";
import { lcmArray } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const directions = lines.shift()!!.split("");
  lines.shift();

  const nodeMap = lines.map(line => {
    const match = line.match(/([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/)!!;
    return {
      name: match[1],
      left: match[2],
      right: match[3],
    }
  }).reduce((nodeMap, node) => {
    nodeMap[node.name] = node;
    return nodeMap;
  }, {} as Record<string, { name: string, left: string, right: string }>)

  return { directions, nodeMap };
}

function* createDirectionLoop(directions: string[]): Generator<string> {
  let index = 0;
  while (true) {
    yield directions[index];
    index = (index + 1) % (directions.length);
  }
}

const part1 = (rawInput: string) => {
  const { directions, nodeMap } = parseInput(rawInput);

  const directionGenerator = createDirectionLoop(directions);
  const end = "ZZZ";
  let currentNode = "AAA";
  let hops = 0;

  while (currentNode !== end) {
    hops++;
    const nextDirection = directionGenerator.next().value;
    const node = nodeMap[currentNode];

    if (nextDirection === "R") {
      currentNode = node.right;
    } else {
      currentNode = node.left;
    }
  }

  return hops;
};

const part2 = (rawInput: string) => {
  const { directions, nodeMap } = parseInput(rawInput);
  const startNodes = Object.keys(nodeMap).filter(node => node.endsWith("A"));

  const hopsToEnd = startNodes.map(startNode => {
    const directionGenerator = createDirectionLoop(directions);
    let currentNode = startNode;
    let hops = 0;

    while (!currentNode.endsWith("Z")) {
      hops++;
      const nextDirection = directionGenerator.next().value;
      const node = nodeMap[currentNode];

      if (nextDirection === "R") {
        currentNode = node.right;
      } else {
        currentNode = node.left;
      }
    }

    return hops;
  });

  return lcmArray(hopsToEnd);
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

QQA = (QQB, XXX)
QQB = (XXX, QQZ)
QQZ = (QQB, XXX)
WWA = (WWB, XXX)
WWB = (WWC, WWC)
WWC = (WWZ, WWZ)
WWZ = (WWB, WWB)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
