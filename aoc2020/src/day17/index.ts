import run from "aocrunner";
import { toSetToken3d } from "../utils/index.js";

type Cube = { y: number, x: number, z: number, state: boolean };

const parseInput = (rawInput: string) => {
  let maxX = 0;
  const lines = rawInput.split("\n");
  const maxY = lines.length - 1;
  const cubes = lines.reduce((acc, line, y) => {
    maxX = line.length - 1;
    line.split("").forEach((char, x) => {
      const cube = { z: 0, y, x, state: char === "#" };
      acc[toSetToken3d(cube)] = cube;
    });

    return acc;
  }, {} as Record<string, Cube>);
  return { cubes, minY: 0, maxY, minX: 0, maxX };
}

const getAdjacentCubes = (z: number, y: number, x: number, cubes: Record<string, Cube>) => {
  const adjacent: Cube[] = [];
  for (let zMod = -1; zMod < 2; zMod++) {
    for (let yMod = -1; yMod < 2; yMod++) {
      for (let xMod = -1; xMod < 2; xMod++) {
        const candidate = { z: z + zMod, y: y + yMod, x: x + xMod };
        if (candidate.z === z && candidate.y === y && candidate.x === x) {
          continue;
        }
        let cube = cubes[toSetToken3d(candidate)];
        if (!cube) {
          cube = { z: candidate.z, y: candidate.y, x: candidate.x, state: false };
          cubes[toSetToken3d(cube)] = cube;
        }
        adjacent.push(cube);
      }
    }
  }
  return adjacent;
}

const part1 = (rawInput: string) => {
  const { cubes, minY: minYInit, maxY: maxYInit, minX: minXInit, maxX: maxXInit } = parseInput(rawInput);

  let minY = minYInit;
  let maxY = maxYInit;
  let minX = minXInit;
  let maxX = maxXInit;
  let minZ = 0;
  let maxZ = 0;
  let turns = 0;
  while (turns < 6) {
    minY -= 1;
    maxY += 1;
    minX -= 1;
    maxX += 1;
    minZ -= 1;
    maxZ += 1;

    let nextCubes: Cube[] = [];
    for (let z = minZ; z <= maxZ; z++) {
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const cube = cubes[toSetToken3d({ z, y, x })];
          const adjacentCubes = getAdjacentCubes(z, y, x, cubes);

          const activeNeighbors = adjacentCubes.filter(c => c.state).length;
          if (cube && cube.state && (activeNeighbors < 2 || activeNeighbors > 3)) {
            nextCubes.push({ z, y, x, state: false });
          } else if ((!cube || !cube.state) && activeNeighbors === 3) {
            nextCubes.push({ z, y, x, state: true });
          }
        }
      }
    }

    for (let cube of nextCubes) {
      cubes[toSetToken3d(cube)] = cube;
    }
    turns++;
  }

  return Object.values(cubes).filter(c => c.state).length;
};

type FourDeeTimeCube = { w: number, z: number, y: number, x: number, state: boolean };
const toSetToken4d = (thing: { w: number, z: number, y: number, x: number }): string => `[${thing.w},${thing.z},${thing.y},${thing.x}]`;

const getAdjacentCubes4d = (w: number, z: number, y: number, x: number, cubes: Record<string, FourDeeTimeCube>) => {
  const adjacent: FourDeeTimeCube[] = [];
  for (let wMod = -1; wMod < 2; wMod++) {
    for (let zMod = -1; zMod < 2; zMod++) {
      for (let yMod = -1; yMod < 2; yMod++) {
        for (let xMod = -1; xMod < 2; xMod++) {
          const candidate = { w: w + wMod, z: z + zMod, y: y + yMod, x: x + xMod };
          if (candidate.w === w && candidate.z === z && candidate.y === y && candidate.x === x) {
            continue;
          }
          let cube = cubes[toSetToken4d(candidate)];
          if (!cube) {
            cube = { w: candidate.w, z: candidate.z, y: candidate.y, x: candidate.x, state: false };
            cubes[toSetToken4d(cube)] = cube;
          }
          adjacent.push(cube);
        }
      }
    }
  }
  return adjacent;
}


const part2 = (rawInput: string) => {
  const { cubes: threeDeeCubes, minY: minYInit, maxY: maxYInit, minX: minXInit, maxX: maxXInit } = parseInput(rawInput);

  const cubes = Object.values(threeDeeCubes).reduce((acc, c) => {
    const newCube = c as FourDeeTimeCube;
    newCube.w = 0;
    acc[toSetToken4d(newCube)] = newCube;
    return acc;
  }, {} as Record<string, FourDeeTimeCube>);
  // console.log(cubes);

  let minY = minYInit;
  let maxY = maxYInit;
  let minX = minXInit;
  let maxX = maxXInit;
  let minZ = 0;
  let maxZ = 0;
  let minW = 0;
  let maxW = 0;
  let turns = 0;
  while (turns < 6) {
    minY -= 1;
    maxY += 1;
    minX -= 1;
    maxX += 1;
    minZ -= 1;
    maxZ += 1;
    minW -= 1;
    maxW += 1;

    let nextCubes: FourDeeTimeCube[] = [];
    for (let w = minW; w <= maxW; w++) {
      for (let z = minZ; z <= maxZ; z++) {
        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            const cube = cubes[toSetToken4d({ w, z, y, x })];
            const adjacentCubes = getAdjacentCubes4d(w, z, y, x, cubes);

            const activeNeighbors = adjacentCubes.filter(c => c.state).length;

            // console.log({ z, y, x }, cube, activeNeighbors);
            if (z === 0 && y === 2 && x === 1) {
              // console.log(cube, adjacentCubes);
            }
            if (cube && cube.state && (activeNeighbors < 2 || activeNeighbors > 3)) {
              nextCubes.push({ w, z, y, x, state: false });
            } else if ((!cube || !cube.state) && activeNeighbors === 3) {
              nextCubes.push({ w, z, y, x, state: true });
            }
          }
        }
      }
    }

    for (let cube of nextCubes) {
      cubes[toSetToken4d(cube)] = cube;
    }
    turns++;
  }

  // console.log(Object.values(cubes).filter(c => c.state));
  return Object.values(cubes).filter(c => c.state).length;
};

run({
  part1: {
    tests: [
      {
        input: `
.#.
..#
###`,
        expected: 112,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
.#.
..#
###`,
        expected: 848,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
