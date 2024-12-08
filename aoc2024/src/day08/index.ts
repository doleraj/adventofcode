import run from "aocrunner";

interface Coordinate { y: number; x: number }

const inBounds = (pos: Coordinate, maxY: number, maxX: number): boolean => {
  return pos.y >= 0 && pos.y <= maxY && pos.x >= 0 && pos.x <= maxX;
}

const printGrid = (nodesMap: Record<string, Coordinate[]>, antiNodes: Coordinate[], maxY: number, maxX: number) => {
  const adjustedNodes = Object.keys(nodesMap).map(key => {
    return nodesMap[key].map(node => ({ y: node.y, x: node.x, key }));
  }).flat();

  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      const nodeAtLocation = adjustedNodes.filter(val => val.y === y && val.x === x)[0];
      if (antiNodes.filter(val => val.x === x && val.y === y).length > 0) {
        line += "#";
      } else if (nodeAtLocation) {
        line += nodeAtLocation.key;
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

const parseInput = (rawInput: string) => {
  const nodesMap: Record<string, Coordinate[]>  = {}
  let maxY = 0, maxX = 0;
  rawInput.split("\n").forEach((line, y) => line.split("").forEach((char, x) => {
    if (y > maxY) maxY = y;
    if (x > maxX) maxX = x;
    if (char === ".") {
      return;
    }

    if (!nodesMap[char]) {
      nodesMap[char] = [];
    }

    nodesMap[char].push({ y, x });
  }));

  return { nodesMap, maxY, maxX };
}

function generatePairs(nodesMap: Record<string, Coordinate[]>, key: string) {
  return nodesMap[key]
    .map((node, _idx, array) => {
      return array.map((otherNode) => {
        if (node === otherNode) {
          return null;
        }

        return [node, otherNode];
      });
    })
    .flat(1)
    .filter((pair) => pair != null) as Coordinate[][];
}

const part1 = (rawInput: string) => {
  const { nodesMap, maxY, maxX } = parseInput(rawInput);

  // So, for each type of node...
  const antiNodeLocations = new Set<String>();
  Object.keys(nodesMap).forEach((key) => {
    // ...if the nodes need to be on a line to get antinodes, we need to get all pairings
    const pairings = generatePairs(nodesMap, key);

    const antiNodesForKey = pairings.map(([a , b]) => {
      // console.log(`Pair is %o, %o`, a, b)
      const deltaY = a.y - b.y;
      const deltaX = a.x - b.x;
      // console.log(`Deltas are dy: %o, dx: %o`, deltaY, deltaX);

      const potentialAntinode1 = { y: a.y + deltaY, x: a.x + deltaX };
      const potentialAntinode2 = { y: b.y - deltaY, x: b.x - deltaX };

      const antiNodes = [];
      if (inBounds(potentialAntinode1, maxY, maxX)) {
        // console.log(`Adding antinode %o`, potentialAntinode1)
        antiNodes.push(potentialAntinode1);
      }
      if (inBounds(potentialAntinode2, maxY, maxX)) {
        // console.log(`Adding antinode %o`, potentialAntinode2)
        antiNodes.push(potentialAntinode2);
      }
      return antiNodes;
    }).flat();
    antiNodesForKey.forEach(antinode => antiNodeLocations.add(`{ y: ${antinode.y}, x: ${antinode.x} }`));
  });

  return antiNodeLocations.size;
};

const part2 = (rawInput: string) => {
  const { nodesMap, maxY, maxX } = parseInput(rawInput);

  const antiNodeLocations = new Set<String>();
  Object.keys(nodesMap).forEach((key) => {
    const pairings = nodesMap[key].map((node, _idx, array) => {
      return array.map((otherNode) => {
        if (node === otherNode) {
          return null;
        }

        return [node, otherNode];
      });

    }).flat(1).filter(pair => pair != null) as Coordinate[][];

    const antiNodesForKey = pairings.map(([a , b]) => {
      const deltaY = a.y - b.y;
      const deltaX = a.x - b.x;

      const antiNodes = [];
      antiNodes.push(b);

      let tempNode = a;
      while (inBounds(tempNode, maxY, maxX)) {
        antiNodes.push(tempNode);

        tempNode = { y: tempNode.y + deltaY, x: tempNode.x + deltaX };
      }

      tempNode = b;
      while (inBounds(tempNode, maxY, maxX)) {
        antiNodes.push(tempNode);

        tempNode = { y: tempNode.y - deltaY, x: tempNode.x - deltaX };
      }

      return antiNodes;
    }).flat();
    antiNodesForKey.forEach(antinode => antiNodeLocations.add(`{ y: ${antinode.y}, x: ${antinode.x} }`));
  });

  return antiNodeLocations.size;
};

run({
  part1: {
    tests: [
      {
        input: `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [

      {
        input: `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
