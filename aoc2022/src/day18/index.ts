import run from "aocrunner";

export function getAdjacentSurfacesCount(voxels: Set<string>): number {
  let connectedPlanes = 0

  for (let current of voxels) {
    const [x, y, z] = current.split(',').map(Number)
    if (voxels.has([x - 1, y, z].toString())) connectedPlanes += 1
    if (voxels.has([x + 1, y, z].toString())) connectedPlanes += 1
    if (voxels.has([x, y - 1, z].toString())) connectedPlanes += 1
    if (voxels.has([x, y + 1, z].toString())) connectedPlanes += 1
    if (voxels.has([x, y, z - 1].toString())) connectedPlanes += 1
    if (voxels.has([x, y, z + 1].toString())) connectedPlanes += 1
  }
  return connectedPlanes / 2
}

export function getSurfaces(voxels: Set<string>): number {
  return voxels.size * 6 - getAdjacentSurfacesCount(voxels) * 2
}

export function getCounterForm(voxels: Set<string>, minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): Set<string> {
  // console.log(`minX ${minX} minY ${minY} minZ ${minX}`)
  // console.log(`maxX ${maxX} maxY ${maxY} maxZ ${maxZ}`)

  const filled = new Set<string>();

  function fill(x: number, y: number, z: number): void {
    if (filled.has([x, y, z].toString())
      || voxels.has([x, y, z].toString())
      || (x < minX || x > maxX || y < minY || y > maxY || z < minZ || z > maxZ)
    ) {
      return;
    }

    filled.add([x, y, z].toString())

    fill(x + 1, y, z)
    fill(x - 1, y, z)
    fill(x, y + 1, z)
    fill(x, y - 1, z)
    fill(x, y, z + 1)
    fill(x, y, z - 1)
  }
  fill(minX, minY, minZ)

  return filled
}

export function getOuterSurfaces(voxels: Set<string>, minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): number {
  const counterVoxels = getCounterForm(voxels, minX, maxX, minY, maxY, minZ, maxZ)
  const allSurfaces = getSurfaces(counterVoxels)

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const depth = maxZ - minZ + 1;

  return allSurfaces - width * height * 2 - width * depth * 2 - depth * height * 2;
}

const parseInput = (rawInput: string) => {
  const occupiedCells = rawInput.split("\n").map(line => line.split(",").map(Number));
  const minX = occupiedCells.map(cells => cells[0]).sort((a, b) => a - b)[0] - 1;
  const maxX = occupiedCells.map(cells => cells[0]).sort((a, b) => b - a)[0] + 1;
  const minY = occupiedCells.map(cells => cells[1]).sort((a, b) => a - b)[0] - 1;
  const maxY = occupiedCells.map(cells => cells[1]).sort((a, b) => b - a)[0] + 1;
  const minZ = occupiedCells.map(cells => cells[2]).sort((a, b) => a - b)[0] - 1;
  const maxZ = occupiedCells.map(cells => cells[2]).sort((a, b) => b - a)[0] + 1;
  const grid = Array.from({ length: maxX + 1})
    .map(_ => Array.from({ length: maxY + 1})
      .map(_ => Array.from( { length: maxZ + 1})
        .map(_ => 0)));

  occupiedCells.forEach(cells => grid[cells[0]][cells[1]][cells[2]] = 1)

  return { occupiedCells, minX, minY, minZ, maxX, maxY, maxZ, grid };
}

function calculateOpenFaces(occupiedCells: number[][], grid: number[][][], maxX: number, maxY: number, maxZ: number) {
  return occupiedCells.reduce((accum, cell) => {
    let openFaces = 0;
    if (cell[0] === 0 || grid[cell[0] - 1][cell[1]][cell[2]] === 0) {
      openFaces++;
    }
    if (cell[0] === maxX || grid[cell[0] + 1][cell[1]][cell[2]] === 0) {
      openFaces++;
    }
    if (cell[1] === 0 || grid[cell[0]][cell[1] - 1][cell[2]] === 0) {
      openFaces++;
    }
    if (cell[1] === maxY || grid[cell[0]][cell[1] + 1][cell[2]] === 0) {
      openFaces++;
    }
    if (cell[2] === 0 || grid[cell[0]][cell[1]][cell[2] - 1] === 0) {
      openFaces++;
    }
    if (cell[2] === maxZ || grid[cell[0]][cell[1]][cell[2] + 1] === 0) {
      openFaces++;
    }
    // console.log(`faces for ${cell} - ${openFaces}`);
    return accum + openFaces;
  }, 0);
}

const part1 = (rawInput: string) => {
  const { occupiedCells, maxX, maxY, maxZ, grid } = parseInput(rawInput);
  // console.log(`${maxX}, ${maxY}, ${maxZ}`);

  const openFaces = calculateOpenFaces(occupiedCells, grid, maxX, maxY, maxZ);
  return openFaces;
};

const part2 = (rawInput: string) => {
  const { occupiedCells, minX, maxX, minY, maxY, minZ, maxZ, grid } = parseInput(rawInput);
  const voxels = new Set<string>();
  occupiedCells.forEach(cell => voxels.add(cell.toString()));

  return getOuterSurfaces(voxels, minX, maxX, minY, maxY, minZ, maxZ);
};

run({
  part1: {
    tests: [
      {
        input: `
1,1,1
2,1,1
`,
        expected: 10,
      },
      {
        input: `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1,1,1
2,1,1
`,
        expected: 10,
      },
      {
        input: `
2,2,1
1,2,2
2,1,2
3,2,2
2,3,2
2,2,3`,
        expected: 30,
      },
      {
        input: `
2,2,1
1,2,2
2,1,2
3,3,2
2,3,2
2,2,3
3,1,2
3,2,3
3,2,1
4,2,2
`,
        expected: 42,
      },
      {
        input: `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`,
        expected: 58,
      },
      {
        input: `
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
