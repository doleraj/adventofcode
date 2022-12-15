import run from "aocrunner";

Array.prototype.toString = function() {
  return `[${this.join(",")}]`;
}

interface Detection {
  sensor: number[];
  beacon: number[];
  distance: number
}

const manhattanDistance = (a: number[], b: number[]): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

const positionInRange = (position: number[], detection: Detection): boolean => {
  // console.log(`===${position} vs ${detection.sensor}, ${detection.beacon}, ${detection.distance}===`)
  // console.log(`Checking ${position[0]} against x check: ${detection.sensor[0] - detection.distance} to ${(detection.sensor[0] + detection.distance)}`);
  // console.log(`Checking ${position[1]} against y check: ${detection.sensor[1] - detection.distance} to ${(detection.sensor[1] + detection.distance)}`);
  return manhattanDistance(position, detection.sensor) <= detection.distance;
};

const parseInput = (rawInput: string) => {
  const detections: Detection[] = [];
  rawInput.split("\n").forEach(line => {
    const match = line
      .match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)!!
      .map(Number);
    const sensor = [match[1], match[2]];
    const beacon = [match[3], match[4]];
    detections.push({
      sensor,
      beacon,
      distance: manhattanDistance(sensor, beacon),
    });
  });

  return detections;
}

const parseInput2 = (rawInput: string) => {
  const detections: SnazzyDetection[] = [];
  let count = 0;
  rawInput.split("\n").forEach(line => {
    console.log(`Detection ${++count}`);
    const match = line
      .match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)!!
      .map(Number);
    const sensor = [match[1], match[2]];
    const beacon = [match[3], match[4]];
    detections.push(new SnazzyDetection(sensor, beacon));
  });

  return detections;
}

const part1 = (rawInput: string) => {
  const detections = parseInput(rawInput);
  const minX = detections.map(d => [d.sensor[0], d.beacon[0], d.sensor[0] - d.distance]).flat(1)
    .sort((a, b) => a - b)[0];
  const minY = detections.map(d => [d.sensor[1], d.beacon[1], d.sensor[1] - d.distance]).flat(1)
    .sort((a, b) => a - b)[0];
  const maxX = detections.map(d => [d.sensor[0], d.beacon[0], d.sensor[0] + d.distance]).flat(1)
    .sort((a, b) => b - a)[0];
  const maxY = detections.map(d => [d.sensor[1], d.beacon[1], d.sensor[1] + d.distance]).flat(1)
    .sort((a, b) => b - a)[0];
  return 1;

  const row = 2000000;
  let excludedPositions = 0;
  for (let x = minX; x <= maxX; x++) {
    const checkPosition = [x, row];
    let detected = false;
    let detectionIndex = 0;
    while (!detected && detectionIndex < detections.length) {
      detected = positionInRange(checkPosition, detections[detectionIndex++]);
    }

    // console.log(`[${x}, ${row}] ${detectedArr}`);
    if (detected && !detections.map(d => d.beacon.toString()).includes(checkPosition.toString())) {
      excludedPositions++;
    }
  }

  return excludedPositions;
};

class SnazzyDetection implements Detection {
  beacon: number[];
  distance: number;
  sensor: number[];
  edges: number[][];

  constructor(sensor: number[], beacon: number[]) {
    this.sensor = sensor;
    this.beacon = beacon;
    this.distance = manhattanDistance(sensor, beacon);
    this.edges = [];

    const minX = this.sensor[0] - this.distance;
    // const maxX = Math.min(4000000, this.sensor[0] + this.distance);
    const maxX = this.sensor[0] + this.distance;
    // console.log(`minX ${minX}, maxX ${maxX}, minY ${minY}, maxY ${maxY}`)

    let yMod = 0;
    let count = 0;
    for (let x = minX; x <= maxX; x++) {
      if (count % 100000 === 0) {
        console.log(`column count is ${count++}`);
      }

      const midY = sensor[1];
      // console.log(`yMod: ${yMod} midY: ${midY}`);
      const foo = [midY + yMod, midY - yMod];
      // console.log(foo);
      // const nextBigY = Math.min(midY + yMod, 20);
      const nextBigY = Math.min(midY + yMod, 4000000);
      const nextSmallY = Math.max(midY - yMod, 0);
      // if (x >= 0 &&  x <= 20) {
      if (x >= 0 &&  x <= 4000000) {
        this.edges[x] = [nextBigY, nextSmallY];
      }
      // console.log(this.edges[x]);
      if (x < sensor[0]) {
        yMod++;
      } else if (x >= sensor[0]) {
        yMod--;
      }
    }
    // console.log(this.edges);
  }
}

const part2 = (rawInput: string) => {
  const detections = parseInput2(rawInput);

  const collectedEdges = detections.reduce((accum, next) => {
    next.edges.forEach((set, index) => {
      if (!accum[index]) {
        accum[index] = [];
      }
      accum[index].push(set.sort((a, b) => a - b));
    });
    return accum;
  }, [] as number[][][]);
  // console.log(collectedEdges.map((value, index) => `${index}: ${value}`));

  const edgesMap: number[][][] = [];
  collectedEdges.forEach((edges, xIndex) => {
    let hitBottom = 0;
    while (edges.length > 1 && hitBottom < 2) {
      // console.log(`==== ${xIndex}`)
      const edge = edges.pop()!!;
      // console.log(edge);
      // console.log(edges);
      const foundIndex = edges.findIndex(value => {
        const edgeIntersectsValue = (value[0] <= edge[0] && edge[0] <= value[1]) || (value[0] <= edge[1] && edge[1] <= value[1]);
        const valueIntersectsEdge = (edge[0] <= value[0] && value[0] <= edge[1]) || (edge[0] <= value[1] && value[1] <= edge[1]);
        // console.log(`value: ${value} edge ${edge} - eiv ${edgeIntersectsValue} vie ${valueIntersectsEdge}`)
        const edgeBordersValue = value[1] === edge[0] + 1 || edge[0] === value[1] + 1;
        const valueBordersEdge = edge[1] === value[0] + 1 || edge[1] === value[0] + 1;
        // console.log(`value: ${value} edge ${edge} - ebv ${edgeBordersValue} vbe ${valueBordersEdge}`)
        return edgeIntersectsValue || valueIntersectsEdge || edgeBordersValue || valueBordersEdge;
      });
      // console.log(foundIndex);
      if (foundIndex < 0) {
        hitBottom++;
        edges.unshift(edge);
        continue;
      }
      const foundEdge = edges.splice(foundIndex, 1)[0];
      const combinedEdge = [Math.min(foundEdge[0], edge[0], foundEdge[1], edge[1]), Math.max(foundEdge[0], edge[0], foundEdge[1], edge[1])];
      edges.push(combinedEdge);
    }
    edgesMap[xIndex] = edges;
  });
  // console.log(edgesMap.map((value, index) => `${index}: ${value}`))
  const safeX = edgesMap.findIndex(value => value.length > 1);
  const safeColumnRanges = edgesMap[safeX];
  const safeY = safeColumnRanges.flat(2).sort((a, b) => a - b )[1] + 1;

  return (safeX * 4000000) + safeY;
};

run({
  part1: {
    tests: [
//       {
//         input: `
// Sensor at x=2, y=18: closest beacon is at x=-2, y=15
// Sensor at x=9, y=16: closest beacon is at x=10, y=16
// Sensor at x=13, y=2: closest beacon is at x=15, y=3
// Sensor at x=12, y=14: closest beacon is at x=10, y=16
// Sensor at x=10, y=20: closest beacon is at x=10, y=16
// Sensor at x=14, y=17: closest beacon is at x=10, y=16
// Sensor at x=8, y=7: closest beacon is at x=2, y=10
// Sensor at x=2, y=0: closest beacon is at x=2, y=10
// Sensor at x=0, y=11: closest beacon is at x=2, y=10
// Sensor at x=20, y=14: closest beacon is at x=25, y=17
// Sensor at x=17, y=20: closest beacon is at x=21, y=22
// Sensor at x=16, y=7: closest beacon is at x=15, y=3
// Sensor at x=14, y=3: closest beacon is at x=15, y=3
// Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
//         expected: 26,
//       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
            {
              // Sensor at x=8, y=7: closest beacon is at x=2, y=10`,
        input: `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
