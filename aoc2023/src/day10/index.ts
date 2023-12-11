import run from "aocrunner";
import "../utils/index.js";

interface Position { x: number, y: number }

interface PipeNode {
  position: Position;
  distance: number;
  children: PipeNode[];
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  let animalPos: Position =  { x: -1, y: -1};
  const rawGrid = lines.map((line, y) => {
    return line.split("").map((char, x) => {
      if (char === "S") {
        animalPos = { x, y };
      }
      return char;
    });
  });

  return { animalPos, rawGrid };
}

const getStringIdForPosition = (position: Position) => {
  return `${position.y}+${position.x}`;
};

const createChildNode = (position: Position, parentNode: PipeNode, nodeList: Map<string, PipeNode>) => {
  // console.log(`Adding node with y: ${position.y} and x: ${position.x}`);
  const node = {
    distance: parentNode.distance + 1,
    position,
    children: [ parentNode ],
  };
  nodeList.set(getStringIdForPosition(position), node);
  parentNode.children.push(node);
  return node;
}

const part1 = (rawInput: string) => {
  const { animalPos, rawGrid } = parseInput(rawInput);

  // Determine the pipe under the animal
  const topConnects = animalPos.y !== 0
      && (rawGrid[animalPos.y - 1][animalPos.x] === "|" || rawGrid[animalPos.y - 1][animalPos.x] === "7" || rawGrid[animalPos.y - 1][animalPos.x] === "F");
  const leftConnects = animalPos.x !== 0
      && (rawGrid[animalPos.y][animalPos.x - 1] === "-" || rawGrid[animalPos.y][animalPos.x - 1] === "L" || rawGrid[animalPos.y][animalPos.x - 1] === "F");
  const bottomConnects = animalPos.y !== rawGrid.length - 1
      && (rawGrid[animalPos.y + 1][animalPos.x] === "|" || rawGrid[animalPos.y + 1][animalPos.x] === "L" || rawGrid[animalPos.y + 1][animalPos.x] === "J");
  const rightConnects = animalPos.x !== rawGrid[0].length - 1
      && (rawGrid[animalPos.y][animalPos.x + 1] === "-" || rawGrid[animalPos.y][animalPos.x + 1] === "7" || rawGrid[animalPos.y][animalPos.x + 1] === "J");

  // console.log(`topConnects ${topConnects} leftConnects ${leftConnects} bottomConnects ${bottomConnects} rightConnects ${rightConnects}`);

  const animalNode: PipeNode = {
    distance: 0,
    position: animalPos,
    children: [],
  }
  const nodes = new Map<string, PipeNode>()
  nodes.set(getStringIdForPosition(animalPos), animalNode);

  // It shouldn't ever have more than 2 conditions because it's a loop but if it does, we're in Undefined Behavior Land
  if (topConnects && bottomConnects) {
    rawGrid[animalPos.y][animalPos.x] = "|";
  } else if (leftConnects && rightConnects) {
    rawGrid[animalPos.y][animalPos.x] = "-";
  } else if (topConnects && leftConnects) {
    rawGrid[animalPos.y][animalPos.x] = "J";
  } else if (topConnects && rightConnects) {
    rawGrid[animalPos.y][animalPos.x] = "L";
  } else if (bottomConnects && leftConnects) {
    rawGrid[animalPos.y][animalPos.x] = "7";
  } else if (bottomConnects && rightConnects) {
    rawGrid[animalPos.y][animalPos.x] = "F";
  }

  const nextNodes: PipeNode[] = [ animalNode ];

  // Build a graph of the loop, marking distances as we go
  while (nextNodes.length > 0) {
    const node = nextNodes.sort((nodeA, nodeB) => nodeB.distance - nodeA.distance).pop()!!;
    const symbol = rawGrid[node.position.y][node.position.x];
    // console.log("************");
    // console.log(`At y: ${node.position.y}, x: ${node.position.x}, symbol is ${symbol}`);
    // console.log(rawGrid[node.position.y]);

    if (symbol === "|") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y - 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y - 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y + 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y + 1, x: node.position.x }, node, nodes));
      }
    } else if (symbol === "-") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x - 1}))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x - 1 }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x + 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x + 1 }, node, nodes));
      }
    } else if (symbol === "L") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y - 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y - 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x + 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x + 1 }, node, nodes));
      }
    } else if (symbol === "J") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y - 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y - 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x - 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x - 1 }, node, nodes));
      }
    } else if (symbol === "7") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y + 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y + 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x - 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x - 1 }, node, nodes));
      }
    } else if (symbol === "F") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y + 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y + 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x + 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x + 1 }, node, nodes));
      }
    } else {
      throw Error(`Something has gone terribly wrong, got symbol ${symbol}.`);
    }
    // console.log(nextNodes);
  }
  // console.log(nodes);


  return Array.from(nodes.values()).sort((nodeA, nodeB) => nodeB.distance - nodeA.distance)[0].distance;
};

const part2 = (rawInput: string) => {
  const { animalPos, rawGrid } = parseInput(rawInput);

  // Determine the pipe under the animal
  const topConnects = animalPos.y !== 0
      && (rawGrid[animalPos.y - 1][animalPos.x] === "|" || rawGrid[animalPos.y - 1][animalPos.x] === "7" || rawGrid[animalPos.y - 1][animalPos.x] === "F");
  const leftConnects = animalPos.x !== 0
      && (rawGrid[animalPos.y][animalPos.x - 1] === "-" || rawGrid[animalPos.y][animalPos.x - 1] === "L" || rawGrid[animalPos.y][animalPos.x - 1] === "F");
  const bottomConnects = animalPos.y !== rawGrid.length - 1
      && (rawGrid[animalPos.y + 1][animalPos.x] === "|" || rawGrid[animalPos.y + 1][animalPos.x] === "L" || rawGrid[animalPos.y + 1][animalPos.x] === "J");
  const rightConnects = animalPos.x !== rawGrid[0].length - 1
      && (rawGrid[animalPos.y][animalPos.x + 1] === "-" || rawGrid[animalPos.y][animalPos.x + 1] === "7" || rawGrid[animalPos.y][animalPos.x + 1] === "J");

  // console.log(`topConnects ${topConnects} leftConnects ${leftConnects} bottomConnects ${bottomConnects} rightConnects ${rightConnects}`);

  const animalNode: PipeNode = {
    distance: 0,
    position: animalPos,
    children: [],
  }
  const nodes = new Map<string, PipeNode>()
  nodes.set(getStringIdForPosition(animalPos), animalNode);

  // It shouldn't ever have more than 2 conditions because it's a loop but if it does, we're in Undefined Behavior Land
  if (topConnects && bottomConnects) {
    rawGrid[animalPos.y][animalPos.x] = "|";
  } else if (leftConnects && rightConnects) {
    rawGrid[animalPos.y][animalPos.x] = "-";
  } else if (topConnects && leftConnects) {
    rawGrid[animalPos.y][animalPos.x] = "J";
  } else if (topConnects && rightConnects) {
    rawGrid[animalPos.y][animalPos.x] = "L";
  } else if (bottomConnects && leftConnects) {
    rawGrid[animalPos.y][animalPos.x] = "7";
  } else if (bottomConnects && rightConnects) {
    rawGrid[animalPos.y][animalPos.x] = "F";
  }

  const nextNodes: PipeNode[] = [ animalNode ];

  // Build a graph of the loop, marking distances as we go
  while (nextNodes.length > 0) {
    const node = nextNodes.sort((nodeA, nodeB) => nodeB.distance - nodeA.distance).pop()!!;
    const symbol = rawGrid[node.position.y][node.position.x];
    // console.log("************");
    // console.log(`At y: ${node.position.y}, x: ${node.position.x}, symbol is ${symbol}`);
    // console.log(rawGrid[node.position.y]);

    if (symbol === "|") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y - 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y - 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y + 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y + 1, x: node.position.x }, node, nodes));
      }
    } else if (symbol === "-") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x - 1}))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x - 1 }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x + 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x + 1 }, node, nodes));
      }
    } else if (symbol === "L") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y - 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y - 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x + 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x + 1 }, node, nodes));
      }
    } else if (symbol === "J") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y - 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y - 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x - 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x - 1 }, node, nodes));
      }
    } else if (symbol === "7") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y + 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y + 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x - 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x - 1 }, node, nodes));
      }
    } else if (symbol === "F") {
      if (!nodes.has(getStringIdForPosition({ y: node.position.y + 1, x: node.position.x }))) {
        nextNodes.push(createChildNode({ y: node.position.y + 1, x: node.position.x }, node, nodes));
      }
      if (!nodes.has(getStringIdForPosition({ y: node.position.y, x: node.position.x + 1 }))) {
        nextNodes.push(createChildNode({ y: node.position.y, x: node.position.x + 1 }, node, nodes));
      }
    } else {
      throw Error(`Something has gone terribly wrong, got symbol ${symbol}.`);
    }
    // console.log(nextNodes);
  }
  // console.log(nodes);

  const minY = Math.min(...Array.from(nodes.values()).map(node => node.position.y));
  const maxY = Math.max(...Array.from(nodes.values()).map(node => node.position.y));
  const minX = Math.min(...Array.from(nodes.values()).map(node => node.position.x));
  const maxX = Math.max(...Array.from(nodes.values()).map(node => node.position.x));
  // console.log(`y: ${minY} ${maxY} x: ${minX} ${maxX}`);

  let inboundPoints: Position[] = [];
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      if (nodes.has(getStringIdForPosition({ x, y }))) {
        continue;
      }

      // console.log(`Checking ${y}, ${x}...`);
      let crossings = 0;
      let previousImportantSymbol: string | null = null;
      for (let i = x; i < x + 1000; i++) {
        if (nodes.has(getStringIdForPosition({ x: i, y }))) {
          const node = nodes.get(getStringIdForPosition({ x: i, y }))!!;
          const symbol = rawGrid[node.position.y][node.position.x];
          if (symbol === "-") {
            continue;
          }

          if (symbol === "|") {
            crossings++;
          } else if ((previousImportantSymbol === "F" && symbol === "J") || (previousImportantSymbol === "L" && symbol === "7")) {
            crossings++;
          }
          previousImportantSymbol = symbol;
        } else {
          previousImportantSymbol = null;
        }
      }

      if (crossings % 2 === 1) {
        inboundPoints.push({ x, y });
      }
    }

  }
  // console.log(inboundPoints);

  // 1100 too high.
  return inboundPoints.length;
};

run({
  part1: {
    tests: [
      {
        input: `
.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
