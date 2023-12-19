import run from "aocrunner";
import "../utils/index.js";
import {match} from "node:assert";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => {
    const matches = line.match(/([RDLU])+ (\d+) \(#(\w+)\)/)!!;
    return { direction: matches[1], length: Number.parseInt(matches[2]), color: matches[3] };

  });
}

const part1 = (rawInput: string) => {
  const trenchDirs = parseInput(rawInput);
  const trenchPoints = new Map<string, { x: number, y: number, color: string }>();
  const polyPoints: number[][] = [];

  // Build the trench polygon
  let currPoint = [0, 0];
  let minY = 500000;
  let maxY = -1;
  let minX = 500000;
  let maxX = -1;

  trenchDirs.forEach(({ direction, length, color }) => {
    for (let i = 0; i < length; i++) {
      trenchPoints.set(currPoint.toString(), { y: currPoint[0], x: currPoint[1], color: color});
      minY = Math.min(currPoint[0], minY);
      maxY = Math.max(currPoint[0], maxY);
      minX = Math.min(currPoint[1], minX);
      maxX = Math.max(currPoint[1], maxX);
      // console.log(`Setting y ${currPoint[0]} x ${currPoint[1]}, new mins ${minY} ${minX}`);

      switch (direction) {
        case "U": currPoint[0]--; break;
        case "D": currPoint[0]++; break;
        case "L": currPoint[1]--; break;
        case "R": currPoint[1]++; break;
      }

      if (i === length - 1) {
        polyPoints.push([currPoint[0], currPoint[1]]);
      }
    }
  });

  polyPoints.reverse();
  // console.log(polyPoints);

  let leftSum = 0;
  let rightSum = 0;
  for (let i = 0; i < polyPoints.length; i++) {
    const point1 = polyPoints[i];
    const point2 = i < polyPoints.length - 1 ? polyPoints[i + 1] : polyPoints[0];
    // console.log(`${point1[1]} * ${point2[0]}`);
    leftSum += (point1[1] * point2[0]);
    // console.log(`${point1[0]} * ${point2[1]}`);
    rightSum += (point1[0] * point2[1]);
  }

  const internalArea = (Math.abs(leftSum - rightSum) / 2);
  const area = internalArea + (trenchPoints.size / 2) + 1;

  // for (let y = minY; y <= maxY; y++) {
  //   let line = "";
  //   for (let x = minX; x <= maxX; x++) {
  //     if (trenchPoints.has(`${y},${x}`)) {
  //       line += "#";
  //     } else {
  //       line += '.';
  //     }
  //   }
  //   console.log(line);
  // }

  // 17917
  // 31019 too low
  // 64992 too low
  // 71533 wrong
  // 72899 too high
  return area;
};

const part2 = (rawInput: string) => {
  const trenchDirs = parseInput(rawInput);
  let trenchPointCount = 0;
  const polyPoints: number[][] = [];

  // Build the trench polygon
  let currPoint = [0, 0];

  trenchDirs.forEach(({ color }) => {
    const encodedDir = color.slice(color.length - 1);
    const encodedLength = color.slice(0, color.length - 1);
    const length = Number.parseInt(encodedLength, 16);

    for (let i = 0; i < length; i++) {
      trenchPointCount++;
      // console.log(`Setting y ${currPoint[0]} x ${currPoint[1]}`);

      switch (encodedDir) {
        case "3": currPoint[0]--; break;
        case "1": currPoint[0]++; break;
        case "2": currPoint[1]--; break;
        case "0": currPoint[1]++; break;
      }

      if (i === length - 1) {
        polyPoints.push([currPoint[0], currPoint[1]]);
      }
    }
  });

  polyPoints.reverse();
  // console.log(polyPoints);

  let leftSum = 0;
  let rightSum = 0;
  for (let i = 0; i < polyPoints.length; i++) {
    const point1 = polyPoints[i];
    const point2 = i < polyPoints.length - 1 ? polyPoints[i + 1] : polyPoints[0];
    // console.log(`${point1[1]} * ${point2[0]}`);
    leftSum += (point1[1] * point2[0]);
    // console.log(`${point1[0]} * ${point2[1]}`);
    rightSum += (point1[0] * point2[1]);
  }

  const internalArea = (Math.abs(leftSum - rightSum) / 2);
  // 68548301037319 too low
  // 68548301037320 too low
  // 68548301037382
  return internalArea + (trenchPointCount / 2) + 1;
};

run({
  part1: {
    tests: [
      {
        input: `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
