import run from "aocrunner";

enum Material {
  AIR,
  STONE,
  SAND
}

const parseInput = (rawInput: string, floor: boolean = false) => {
  const lines = rawInput.split("\n");
  const stonePoints = lines.map(line => {
    return line.split(" -> ").reduce((accum, pointStr) => {
      const point = pointStr.split(",").map(Number);
      if (!accum.lastPoint) {
        accum.points.push(point);
      } else {
        if (accum.lastPoint[0] === point[0]) {
          const delta = point[1] - accum.lastPoint[1];
          for (let i = 1; i <= Math.abs(delta); i++) {
            accum.points.push([point[0], accum.lastPoint[1] + (i * Math.sign(delta))]);
          }
        } else {
          // I'm assuming the input doesn't screw with me here. Probably a bad plan.
          const delta = point[0] - accum.lastPoint[0];
          for (let i = 1; i <= Math.abs(delta); i++) {
            accum.points.push([accum.lastPoint[0] + (i * Math.sign(delta)), point[1]]);
          }
        }
      }
      accum.lastPoint = point;
      return accum;
    }, { lastPoint: undefined, points: [] } as { lastPoint?: number[], points: number[][] });
  }).map(accum => accum.points).flat(1);

  const maxY = stonePoints.sort((a, b) => b[1] - a[1])[0][1];
  // const minX = stonePoints.sort((a, b) => a[0] - b[0])[0][0];
  // console.log(maxY);

  const grid = Array.from({ length: 1000 }).map(_ => Array.from({ length: maxY + 2 }).map(_ => Material.AIR));
  // console.log(`Initial grid size: x - ${grid.length}, y - ${grid[0].length}`);
  stonePoints.forEach(stonePoint => {
    grid[stonePoint[0]][stonePoint[1]] = Material.STONE;
  });
  if (floor) {
    grid.forEach(column => column.push(Material.STONE));
  }

  return grid;
}

const printGrid = (grid: number[][], distanceFrom500: number) => {
  for (let y = 0; y < grid[0].length; y++) {
    let str = "";
    for (let x = 500 - distanceFrom500; x < 500 + distanceFrom500; x++) {
      if (x === 500 && y === 0) {
        str += "+";
        continue;
      }

      const cell = grid[x][y];
      switch (cell) {
        case Material.AIR: str += "."; break;
        case Material.STONE: str += "#"; break;
        case Material.SAND: str += "o"; break;
      }
    }
    console.log(str);
  }
};

const applySand = (grid: number[][]): boolean => {
  const currentSand = [500, 0];
  let sandAtRest = false;

  while (!sandAtRest) {
    if (grid[currentSand[0]][currentSand[1] + 1] === Material.AIR) {
      // console.log("sand down 1")
      currentSand[1]++;
    } else if (grid[currentSand[0] - 1][currentSand[1] + 1] === Material.AIR) {
      // console.log("sand down left")
      currentSand[0]--;
      currentSand[1]++;
    } else if (grid[currentSand[0] + 1][currentSand[1] + 1] === Material.AIR) {
      // console.log("sand down right")
      currentSand[0]++;
      currentSand[1]++;
    } else if (currentSand[1] === grid[0].length - 1) {
      // infinitely falling sand
      // console.log(currentSand);
      // console.log(grid[currentSand[0]][currentSand[1] + 1]);
      // console.log(grid[currentSand[0] - 1][currentSand[1] + 1]);
      // console.log(grid[currentSand[0] + 1][currentSand[1] + 1]);
      return true;
    } else {
      sandAtRest = true;

      if (currentSand[0] === 500 && currentSand[1] === 0) {
        return true;
      }

      grid[currentSand[0]][currentSand[1]] = Material.SAND;
    }
  }

  return false;
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  let sandFallsInfinitely = false;
  let cycles = 0;
  while (!sandFallsInfinitely) {
    cycles++;
    sandFallsInfinitely = applySand(grid);
  }
  printGrid(grid, 51);

  return cycles - 1;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput, true);
  let sandCoversEntry = false;
  let cycles = 0;
  while (!sandCoversEntry) {
    cycles++;
    sandCoversEntry = applySand(grid);
  }
  printGrid(grid, 201);

  return cycles;
};

run({
  part1: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
