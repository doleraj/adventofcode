import run from "aocrunner";

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

const part2 = (rawInput: string) => {
  const detections = parseInput(rawInput);
  // console.log(detections);
  const minX = Math.max(0,
    detections.map(d => [d.sensor[0], d.beacon[0], d.sensor[0] - d.distance]).flat(1)
      .sort((a, b) => a - b)[0]);
  const minY = Math.max(0,
    detections.map(d => [d.sensor[1], d.beacon[1], d.sensor[1] - d.distance]).flat(1)
    .sort((a, b) => a - b)[0]);
  const maxX = Math.min(4000000,
    detections.map(d => [d.sensor[0], d.beacon[0], d.sensor[0] + d.distance]).flat(1)
    .sort((a, b) => b - a)[0]);
  const maxY =  Math.min(4000000,
    detections.map(d => [d.sensor[1], d.beacon[1], d.sensor[1] + d.distance]).flat(1)
    .sort((a, b) => b - a)[0]);
  // console.log(detections.map(d => `minX ${d.sensor[0] - d.distance}, maxX ${d.sensor[0] + d.distance}, minY ${d.sensor[1] - d.distance}, maxY ${d.sensor[1] + d.distance}`));

  const excludedPositions = [];
  for (let y = minY; y <= maxY; y++) {
    if (y % 1000000 === 0) {
      console.log(`Starting on row ${y}`);
    }
    for (let x = minX; x <= maxX; x++) {
      const checkPosition = [x, y];
      let detected = false;
      let detectionIndex = 0;
      while (!detected && detectionIndex < detections.length) {
        detected = positionInRange(checkPosition, detections[detectionIndex++]);
      }
      // console.log(`[${x}, ${y}] ${detectedArr}`);
      if (!detected) {
        excludedPositions.push(checkPosition);
      }
    }
  }
  if (excludedPositions.length !== 1) {
    console.log(excludedPositions);
    throw new Error("Something is wrong");
  }

  return (excludedPositions[0][0] * 4000000) + excludedPositions[0][1];
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
//             {
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
//         expected: 56000011,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
