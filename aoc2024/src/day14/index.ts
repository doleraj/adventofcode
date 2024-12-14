import run from "aocrunner";
import { doActualModNotFakeAlmostCorrectMod } from "../utils/index.js";

type Robot = { y: number; x: number; dy: number; dx: number; };

const parseInput = (rawInput: string) => {
  const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;
  return rawInput.split("\n").map((line) => {
    const matches = line.match(regex)!!;
    return { x: Number.parseInt(matches[1]), y: Number.parseInt(matches[2]), dx: Number.parseInt(matches[3]), dy: Number.parseInt(matches[4]) } as Robot;
  });
}

const moveRobot = (robot: Robot, maxY: number, maxX: number) => {
  const nextY = doActualModNotFakeAlmostCorrectMod((robot.y + robot.dy), maxY);
  const nextX = doActualModNotFakeAlmostCorrectMod((robot.x + robot.dx), maxX);
  robot.y = nextY;
  robot.x = nextX;
}

const printGrid = (robots: Robot[], maxY: number, maxX: number) => {
  for (let y = 0; y < maxY; y++) {
    let line = "";
    for (let x = 0; x < maxX; x++) {
      const robotCounts = robots.reduce((acc, robot) => {
        return (robot.y === y && robot.x === x) ? acc + 1 : acc;
      }, 0);
      line += robotCounts > 0 ? robotCounts : ".";
    }
    console.log(line);
  }
}

const part1 = (rawInput: string) => {
  const robots = parseInput(rawInput);

  const maxY = robots.length < 13 ? 7 : 103;
  const maxX = robots.length < 13 ? 11 : 101;

  for (let tick = 1; tick <= 100; tick++) {
    for (let robot of robots) {
      moveRobot(robot, maxY, maxX);
    }
  }

  const midY = Math.floor(maxY / 2);
  const midX = Math.floor(maxX / 2);
  let q1Count = 0;
  let q2Count = 0;
  let q3Count = 0;
  let q4Count = 0;

  for (let robot of robots) {
    if (robot.y < midY && robot.x < midX) {
      q1Count++;
    } else if (robot.y < midY && robot.x > midX) {
      q2Count++;
    } else if (robot.y > midY && robot.x < midX) {
      q3Count++;
    } else if (robot.y > midY && robot.x > midX) {
      q4Count++;
    }
  }

  return q1Count * q2Count * q3Count * q4Count;
};

const part2 = (rawInput: string) => {
  const robots = parseInput(rawInput);

  const maxY = robots.length < 13 ? 7 : 103;
  const maxX = robots.length < 13 ? 11 : 101;
  const midY = Math.floor(maxY / 2);
  const midX = Math.floor(maxX / 2);

  let minSafetyCount = Number.POSITIVE_INFINITY;
  let minTick = 0;
  for (let tick = 1; tick <= 100000; tick++) {
    for (let robot of robots) {
      moveRobot(robot, maxY, maxX);
    }

    let q1Count = 0;
    let q2Count = 0;
    let q3Count = 0;
    let q4Count = 0;

    for (let robot of robots) {
      if (robot.y < midY && robot.x < midX) {
        q1Count++;
      } else if (robot.y < midY && robot.x > midX) {
        q2Count++;
      } else if (robot.y > midY && robot.x < midX) {
        q3Count++;
      } else if (robot.y > midY && robot.x > midX) {
        q4Count++;
      }
    }

    const safety = q1Count * q2Count * q3Count * q4Count;
    if (safety < minSafetyCount) {
      printGrid(robots, maxY, maxX);
      minSafetyCount = safety;
      minTick = tick;
    }
  }

  return minTick;
};

run({
  part1: {
    tests: [
      {
        input: `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
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
    // 540 too low
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
