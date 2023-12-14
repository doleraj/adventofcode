import run from "aocrunner";
import "../utils/index.js";

type CubeRock = { x: number, y: number };
type RoundRock = { x: number, y: number, originalX: number, originalY: number };

const parseInput = (rawInput: string) => {
  const cubeRocks: CubeRock[]  = []
  const roundRocks: RoundRock[] = []
  rawInput.split("\n").forEach((line, y) => {
    line.split("").forEach((place, x) => {
      if (place === "O") {
        roundRocks.push({ x, y, originalX: x, originalY: y });
      } else if (place === "#") {
        cubeRocks.push({ x, y });
      }
    });
  });

  return { cubeRocks, roundRocks };
}

const printGrid = (cubeRocks: CubeRock[], roundRocks: RoundRock[]) => {
  const minY = Math.min(cubeRocks.sort((a, b) => a.y - b.y)[0].y, roundRocks.sort((a, b) => a.y - b.y)[0].y);
  const maxY = Math.max(cubeRocks.sort((a, b) => b.y - a.y)[0].y, roundRocks.sort((a, b) => b.y - a.y)[0].y);
  const minX = Math.min(cubeRocks.sort((a, b) => a.x - b.x)[0].x, roundRocks.sort((a, b) => a.x - b.x)[0].x);
  const maxX = Math.max(cubeRocks.sort((a, b) => b.x - a.x)[0].x, roundRocks.sort((a, b) => b.x - a.x)[0].x);

  for (let y = minY; y <= maxY; y++) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      const cubeRock = cubeRocks.find(rock => rock.x === x && rock.y === y);
      const roundRock = roundRocks.find(rock => rock.x === x && rock.y === y);

      if (cubeRock && roundRock) {
        line += "X";
      } else if (cubeRock) {
        line += "#";
      } else if (roundRock) {
        line += "O";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
};

const part1 = (rawInput: string) => {
  const { cubeRocks, roundRocks } = parseInput(rawInput);
  const maxY = Math.max(cubeRocks.sort((a, b) => b.y - a.y)[0].y, roundRocks.sort((a, b) => b.y - a.y)[0].y);

  // start at the second row, then start from the left and move each rock up as far as it will go
  for (let y = 1; y <= maxY; y++) {
    // console.log(`On row ${y}`);
    const rowRoundRocks = roundRocks.filter(rock => rock.y === y).sort((a, b) => a.x - b.x);
    for (const rowRoundRock of rowRoundRocks) {
      let hitARock = false;
      let hitTheEdge = false;
      let yMod = 0;
      while (!hitARock && !hitTheEdge) {
        yMod--;
        // console.log(`ymod is now ${yMod} - rock would be at = ${rowRoundRock.y + yMod}`);
        const cubeRock = cubeRocks.find(rock => rock.x === rowRoundRock.x && rock.y === rowRoundRock.y + yMod);
        const roundRock = roundRocks.find(rock => rock.x === rowRoundRock.x && rock.y === rowRoundRock.y + yMod);
        hitARock = cubeRock !== undefined || roundRock !== undefined;
        hitTheEdge = rowRoundRock.y + yMod === 0;
      }

      if (hitARock) {
        rowRoundRock.y += yMod + 1;
      } else if (hitTheEdge) {
        rowRoundRock.y += yMod;
      }
    }
  }

  // printGrid(cubeRocks, roundRocks);

  return roundRocks.reduce((accum, roundRock) => {
    // console.log(`Total load for rock at ${roundRock.y} is ${maxY - roundRock.y + 1}`);
    const load = maxY - roundRock.y + 1;
    return accum + load;
  }, 0)
};

const rollNorth = (roundRocks: RoundRock[], cubeRocks: CubeRock[]) => {
  const maxY = Math.max(cubeRocks.sort((a, b) => b.y - a.y)[0].y, roundRocks.sort((a, b) => b.y - a.y)[0].y);
  // start at the second row, then start from the left and move each rock up as far as it will go
  for (let y = 1; y <= maxY; y++) {
    // console.log(`On row ${y}`);
    const rowRoundRocks = roundRocks.filter(rock => rock.y === y).sort((a, b) => a.x - b.x);
    for (const rowRoundRock of rowRoundRocks) {
      let hitARock = false;
      let hitTheEdge = false;
      let yMod = 0;
      while (!hitARock && !hitTheEdge) {
        yMod--;
        // console.log(`ymod is now ${yMod} - rock would be at = ${rowRoundRock.y + yMod}`);
        const cubeRock = cubeRocks.find(rock => rock.x === rowRoundRock.x && rock.y === rowRoundRock.y + yMod);
        const roundRock = roundRocks.find(rock => rock.x === rowRoundRock.x && rock.y === rowRoundRock.y + yMod);
        hitARock = cubeRock !== undefined || roundRock !== undefined;
        hitTheEdge = rowRoundRock.y + yMod === 0;
      }

      if (hitARock) {
        rowRoundRock.y += yMod + 1;
      } else if (hitTheEdge) {
        rowRoundRock.y += yMod;
      }
    }
  }
};

const rollWest = (roundRocks: RoundRock[], cubeRocks: CubeRock[]) => {
  const maxX = Math.max(cubeRocks.sort((a, b) => b.x - a.x)[0].x, roundRocks.sort((a, b) => b.x - a.x)[0].x);
  // start at the second column, then start from the top and move each rock west as far as it will go
  for (let x = 1; x <= maxX; x++) {
    // console.log(`On col ${x}`);
    const colRoundRocks = roundRocks.filter(rock => rock.x === x).sort((a, b) => a.x - b.x);
    for (const colRoundRock of colRoundRocks) {
      let hitARock = false;
      let hitTheEdge = false;
      let xMod = 0;
      while (!hitARock && !hitTheEdge) {
        xMod--;
        const cubeRock = cubeRocks.find(rock => rock.y === colRoundRock.y && rock.x === colRoundRock.x + xMod);
        const roundRock = roundRocks.find(rock => rock.y === colRoundRock.y && rock.x === colRoundRock.x + xMod);
        hitARock = cubeRock !== undefined || roundRock !== undefined;
        hitTheEdge = colRoundRock.x + xMod === 0;
      }

      if (hitARock) {
        colRoundRock.x += xMod + 1;
      } else if (hitTheEdge) {
        colRoundRock.x += xMod;
      }
    }
  }
};

const rollSouth = (roundRocks: RoundRock[], cubeRocks: CubeRock[]) => {
  const maxY = Math.max(cubeRocks.sort((a, b) => b.y - a.y)[0].y, roundRocks.sort((a, b) => b.y - a.y)[0].y);
  // start at the second to last row, then start from the left and move each rock up as far as it will go
  for (let y = maxY - 1; y >= 0; y--) {
    // console.log(`On row ${y}`);
    const rowRoundRocks = roundRocks.filter(rock => rock.y === y).sort((a, b) => a.x - b.x);
    for (const rowRoundRock of rowRoundRocks) {
      let hitARock = false;
      let hitTheEdge = false;
      let yMod = 0;
      while (!hitARock && !hitTheEdge) {
        yMod++;
        // console.log(`ymod is now ${yMod} - rock would be at = ${rowRoundRock.y + yMod}`);
        const cubeRock = cubeRocks.find(rock => rock.x === rowRoundRock.x && rock.y === rowRoundRock.y + yMod);
        const roundRock = roundRocks.find(rock => rock.x === rowRoundRock.x && rock.y === rowRoundRock.y + yMod);
        hitARock = cubeRock !== undefined || roundRock !== undefined;
        hitTheEdge = rowRoundRock.y + yMod === maxY;
      }

      if (hitARock) {
        rowRoundRock.y += yMod - 1;
      } else if (hitTheEdge) {
        rowRoundRock.y += yMod;
      }
    }
  }
};

const rollEast = (roundRocks: RoundRock[], cubeRocks: CubeRock[]) => {
  const maxX = Math.max(cubeRocks.sort((a, b) => b.x - a.x)[0].x, roundRocks.sort((a, b) => b.x - a.x)[0].x);
  // start at the second to last row, then start from the left and move each rock up as far as it will go
  for (let x = maxX - 1; x >= 0; x--) {
    // console.log(`On row ${x}`);
    const rowRoundRocks = roundRocks.filter(rock => rock.x === x).sort((a, b) => a.x - b.x);
    for (const rowRoundRock of rowRoundRocks) {
      let hitARock = false;
      let hitTheEdge = false;
      let xMod = 0;
      while (!hitARock && !hitTheEdge) {
        xMod++;
        const cubeRock = cubeRocks.find(rock => rock.y === rowRoundRock.y && rock.x === rowRoundRock.x + xMod);
        const roundRock = roundRocks.find(rock => rock.y === rowRoundRock.y && rock.x === rowRoundRock.x + xMod);
        hitARock = cubeRock !== undefined || roundRock !== undefined;
        hitTheEdge = rowRoundRock.x + xMod === maxX;
      }

      if (hitARock) {
        rowRoundRock.x += xMod - 1;
      } else if (hitTheEdge) {
        rowRoundRock.x += xMod;
      }
    }
  }
};

const part2 = (rawInput: string) => {
  const {cubeRocks, roundRocks} = parseInput(rawInput);
  const maxY = Math.max(cubeRocks.sort((a, b) => b.y - a.y)[0].y, roundRocks.sort((a, b) => b.y - a.y)[0].y);

  const knownStates = new Map<string, number>();
  let cycles = 0;
  let cycleRepeatLength = 0;
  while (!cycleRepeatLength) {
    cycles++;
    rollNorth(roundRocks, cubeRocks);
    rollWest(roundRocks, cubeRocks);
    rollSouth(roundRocks, cubeRocks);
    rollEast(roundRocks, cubeRocks);

    const state = roundRocks.sort((a, b) => a.x - b.x || a.y - b.y).reduce((key, rock) => key += ` ${rock.x}-${rock.y}`, "");
    if (knownStates.has(state)) {
      const lastCycleThiStateWasSeen = knownStates.get(state)!!;
      console.log(`Found loop in cycle ${cycles} after ${cycles - lastCycleThiStateWasSeen}`);
      cycleRepeatLength = cycles - lastCycleThiStateWasSeen;
    } else {
      knownStates.set(state, cycles);
    }
  }
  let cyclesLeft = (1000000000 - cycles) % cycleRepeatLength;
  console.log(`There are ${cyclesLeft} cycles remaining`);
  while (cyclesLeft != 0) {
    cyclesLeft--;
    rollNorth(roundRocks, cubeRocks);
    rollWest(roundRocks, cubeRocks);
    rollSouth(roundRocks, cubeRocks);
    rollEast(roundRocks, cubeRocks);
  }

  // printGrid(cubeRocks, roundRocks);

  return roundRocks.reduce((accum, roundRock) => {
    // console.log(`Total load for rock at ${roundRock.y} is ${maxY - roundRock.y + 1}`);
    const load = maxY - roundRock.y + 1;
    return accum + load;
  }, 0)
};

run({
  part1: {
    tests: [
      {
        input: `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
