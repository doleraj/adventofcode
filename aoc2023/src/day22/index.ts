import run from "aocrunner";
import "../utils/index.js";

type Brick = { id: number, cubes: number[][], supports: number[], supportedBy: Set<number> };

const parseInput = (rawInput: string) => {
  const bricks: Record<number, Brick> = [];
  let brickId = 0;

  rawInput.split("\n").forEach(line => {
    const points = line.split("~").map(part => part.split(",").map(n => Number.parseInt(n)));
    const cubes: number[][] = [];
    if (points[0][0] !== points[1][0]) {
      const min = Math.min(points[0][0], points[1][0]);
      const max = Math.max(points[0][0], points[1][0]);
      for (let x = min; x < max + 1; x++) {
        const cube = [x, points[0][1], points[0][2]];
        cubes.push(cube);
      }
    } else if (points[0][1] !== points[1][1]) {
      const min = Math.min(points[0][1], points[1][1]);
      const max = Math.max(points[0][1], points[1][1]);
      for (let y = min; y < max + 1; y++) {
        const cube = [points[0][0], y, points[0][2]];
        cubes.push(cube);
      }
    } else if (points[0][2] !== points[1][2]) {
      const min = Math.min(points[0][2], points[1][2]);
      const max = Math.max(points[0][2], points[1][2]);
      for (let z = min; z < max + 1; z++) {
        const cube = [points[0][0], points[0][1], z];
        cubes.push(cube);
      }
    } else {
      cubes.push([points[0][0], points[0][1], points[0][2]]);
    }

    cubes.sort((a, b) => a[2] - b[2]);
    bricks[brickId] = { id: brickId++, cubes, supports: [], supportedBy: new Set() };
  });

  return { bricks };
}

function dropBrick(brick: Brick, brickArray: Brick[]) {
  const minZ = brick.cubes[0][2];
  const lowestCubes = brick.cubes.filter(cube => cube[2] === minZ);
  const bricksBelow = brickArray.filter(b => b.cubes.some(cube => cube[2] < minZ));

  if (brick.id === 9 || brick.id === 373) {
    console.log(`Working on brick ${brick.id} - minZ is ${minZ}`);
  }


  let hitBrick = false;
  let timesAdjusted = 0;
  while (minZ > 1 && minZ - timesAdjusted > 1 && !hitBrick) {
    for (const cube of lowestCubes) {
      for (const checkBrick of bricksBelow) {
        if (checkBrick.cubes.findIndex(c => c[0] === cube[0] && c[1] === cube[1] && c[2] === cube[2] - 1) !== -1) {
          hitBrick = true;
          checkBrick.supports.push(brick.id);
          brick.supportedBy.add(checkBrick.id);
        }
      }
    }

    if (!hitBrick) {
      for (const cube of brick.cubes) {
        cube[2] = cube[2] - 1;
      }
    }
    timesAdjusted++;
  }
}


const part1 = (rawInput: string) => {
  const { bricks } = parseInput(rawInput);

  const brickArray = Object.values(bricks);
  brickArray.sort((a, b) => a.cubes[0][2] - b.cubes[0][2]);

  for (const droppedBrick of brickArray) {
    dropBrick(droppedBrick, brickArray);
  }

  brickArray.forEach(brick => brick.supports.sort());

  let deleteable = 0;
  for (const brick of brickArray) {
    // console.log(`Checking brick ${brick.id}`);

    if (brick.supports.length === 0) {
      deleteable++;
      continue;
    }

    let soleSupport = false;
    for (const supportedId of brick.supports) {
      soleSupport = soleSupport || (brickArray.filter(checkBrick => checkBrick.supports.includes(supportedId)).length === 1);
    }

    if (!soleSupport) {
      deleteable++;
    }
  }

  // 389 too low.
  return deleteable;
};

const part2 = (rawInput: string) => {
  const { bricks  } = parseInput(rawInput);
  const brickArray = Object.values(bricks);
  brickArray.sort((a, b) => a.cubes[0][2] - b.cubes[0][2]);

  for (const droppedBrick of brickArray) {
    dropBrick(droppedBrick, brickArray);
  }

  brickArray.sort((a, b) => a.id - b.id);
  brickArray.forEach(brick => brick.supports.sort());

  // 343 too low
  // 1325 too low
  // 73863 too low?
  // 74287?
  // 94309 too high
  return brickArray.map(brick => {

    let remainingBricks = [...brickArray];
    const fallenBricks: number[] = [ brick.id ];
    // console.log(`Checking brick ${brick.id}`);
    let stillCullingBricks = true;
    while (stillCullingBricks) {
      const newBricksThatFell = remainingBricks
          .filter(checkBrick => !fallenBricks.includes(checkBrick.id))
          .filter(checkBrick => checkBrick.supportedBy.size > 0)
          .filter(checkBrick => Array.from(checkBrick.supportedBy).every(supportedById => fallenBricks.includes(supportedById)))
          .map(b => b.id);
      fallenBricks.push(...newBricksThatFell);

      remainingBricks = remainingBricks.filter(b => !newBricksThatFell.includes(b.id));
      stillCullingBricks = newBricksThatFell.length > 0;
    }

    return new Set(fallenBricks).size - 1;
  }).reduce((a, c) => a + c, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
        expected: 7,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

