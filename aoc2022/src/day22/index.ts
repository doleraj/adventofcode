import run from "aocrunner";

enum Facing {
  EAST,
  SOUTH,
  WEST,
  NORTH,
}

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const mapLines = parts[0].split("\n");
  const maxLine = [...mapLines].sort((a, b) => b.length - a.length)[0].length;
  const map = mapLines
    .filter(line => line.trim() !== "")
    .map(line => {
      // console.log(`line is ${line.length}, padded line will be "${line.length === maxLine ? line : line.padEnd(maxLine, " ")}"`)
      return line.length === maxLine ? line : line.padEnd(maxLine, " ")
    })
    .map(line => line.split(""));

  const directions = parts[1].split("").reduce((accum, char) => {
    if (char === "R" || char === "L") {
      accum.push(char);
    } else if (accum.length === 0 || accum[accum.length - 1] === "R" || accum[accum.length - 1] === "L") {
      accum.push(char);
    } else {
      accum[accum.length - 1] += char;
    }

    return accum;
  }, [] as string[]).reverse();
  return { map, directions };
}

function checkForWrap(nextPosition: number[], map: string[][]) {
  if (nextPosition[0] < 0) {
    nextPosition[0] = map.length - 1;
  } else if (nextPosition[1] < 0) {
    nextPosition[1] = map[nextPosition[0]].length - 1;
  } else if (nextPosition[0] >= map.length) {
    nextPosition[0] = 0;
  } else if (nextPosition[1] >= map[nextPosition[0]].length) {
    nextPosition[1] = 0;
  }
}

function performMove(position: number[], map: string[][], modifyPosition: (position: number[]) => number[]) {
  let nextPosition = modifyPosition(position);
  // console.log(`Checking ${nextPosition}`)
  // wrap check
  checkForWrap(nextPosition, map);

  if (map[nextPosition[0]][nextPosition[1]] === " ") {
    while (map[nextPosition[0]][nextPosition[1]] === " ") {
      nextPosition = modifyPosition(nextPosition);
      checkForWrap(nextPosition, map);
    }
  }
  // wall check
  if (map[nextPosition[0]][nextPosition[1]] === "#") {
    nextPosition = position;
  }
  // console.log(`Next pos: ${nextPosition}`);
  return nextPosition;
}

function printMap(map: string[][], positions: { facing: string; position: string }[]) {
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      const posIndex = positions.findIndex(pos => pos.position === [y, x].toString());
      if (posIndex !== -1) {
        const pos = positions[posIndex];
        switch (pos.facing) {
          case "0":
            line += ">";
            break;
          case "1":
            line += "V";
            break;
          case "2":
            line += "<";
            break;
          case "3":
            line += "^";
            break;
        }
      } else {
        line += map[y][x];
      }
    }
    console.log(line);
  }
}

const part1 = (rawInput: string) => {
  const { map, directions } = parseInput(rawInput);
  let position = [0, 8];
  let facing: Facing = Facing.EAST;
  const positions = [{ facing: facing.toString(), position: position.toString() }];
  while (directions.length > 0) {
    const direction = directions.pop();
    // console.log(direction);
    if (direction === "R") {
      switch (facing) {
        case Facing.NORTH: facing = Facing.EAST; break;
        case Facing.EAST: facing = Facing.SOUTH; break;
        case Facing.SOUTH: facing = Facing.WEST; break;
        case Facing.WEST: facing = Facing.NORTH; break;
      }
    } else if (direction === "L") {
      switch (facing) {
        case Facing.NORTH: facing = Facing.WEST; break;
        case Facing.EAST: facing = Facing.NORTH; break;
        case Facing.SOUTH: facing = Facing.EAST; break;
        case Facing.WEST: facing = Facing.SOUTH; break;
      }
    } else {
      let stepsLeft = Number(direction);
      while (stepsLeft > 0) {
        let nextPosition;
        switch (facing) {
          case Facing.NORTH: {
            nextPosition = performMove(position, map, (position: number[]) => [position[0] - 1, position[1]]);
            break;
          }
          case Facing.EAST: {
            nextPosition = performMove(position, map, (position: number[]) => [position[0], position[1] + 1]);
            break;
          }
          case Facing.SOUTH: {
            nextPosition = performMove(position, map, (position: number[]) => [position[0] + 1, position[1]]);
            break;
          }
          case Facing.WEST: {
            nextPosition = performMove(position, map, (position: number[]) => [position[0], position[1] - 1]);
            break;
          }
        }
        if (nextPosition.toString() === position.toString()) {
          stepsLeft = 0;
        }
        position = nextPosition;
        positions.push({ facing: facing.toString(), position: position.toString() });
        stepsLeft--;
      }
    }
  }
  // console.log(`${position} - ${facing}`);
  // printMap(map, positions);
  return (1000 * (position[0] + 1)) + (4 * (position[1] + 1)) + facing.valueOf();
};

const isInTileA = (position: number[]) => {
  return 0 <= position[0] && position[0] <= 49
    && 50 <= position[1] && position[1] <= 99;
};

const isInTileB = (position: number[]) => {
  return 0 <= position[0] && position[0] <= 49
    && 100 <= position[1] && position[1] <= 149;
};

const isInTileC = (position: number[]) => {
  return 50 <= position[0] && position[0] <= 99
    && 50 <= position[1] && position[1] <= 99;
};

const isInTileD = (position: number[]) => {
  return 100 <= position[0] && position[0] <= 149
    && 50 <= position[1] && position[1] <= 99;
};

const isInTileE = (position: number[]) => {
  return 100 <= position[0] && position[0] <= 149
    && 0 <= position[1] && position[1] <= 49;
};

const isInTileF = (position: number[]) => {
  return 150 <= position[0] && position[0] <= 199
    && 0 <= position[1] && position[1] <= 49;
};

function performCubeMove(position: number[], map: string[][], facing: Facing, modifyPosition: (position: number[]) => number[]) {
  let nextPosition = modifyPosition(position);
  let nextFacing = facing;
  // console.log(`Checking ${nextPosition}`)
  // wrap check
  if (nextPosition[0] < 0) {
    if (isInTileA(position)) {
      nextPosition = [nextPosition[1] + 100, 0];
      nextFacing = Facing.EAST;
    } else if (isInTileB(position)) {
      nextPosition = [199, nextPosition[1] - 100];
      nextFacing = facing;
    }
  } else if (nextPosition[1] < 0) {
    if (isInTileE(position)) {
      nextPosition = [Math.abs(149 - nextPosition[0]), 0];
      nextFacing = Facing.EAST;
    } else if (isInTileF(position)) {
      nextPosition = [nextPosition[1] + 100, 0]
      nextFacing = Facing.EAST;
    }
    // nextPosition[1] = map[nextPosition[0]].length - 1;
  } else if (nextPosition[0] >= map.length) {
    // Has to be tile F
    nextPosition = [0, nextPosition[1] + 100];
    nextFacing = facing;
  } else if (nextPosition[1] >= map[nextPosition[0]].length) {
    // Has to be tile B
    nextPosition = [Math.abs(149 - nextPosition[0]), 99];
    nextFacing = Facing.WEST;
  }
  // console.log(`after bounds checking ${nextPosition} ${nextFacing}`)

  if (map[nextPosition[0]][nextPosition[1]] === " ") {
    if (isInTileA(position)) {
      // If we're off the map from tile A, we're going to tile E
      nextPosition = [Math.abs(149 - nextPosition[0]), 0];
      nextFacing = Facing.EAST;
    } else if (isInTileB(position)) {
      // If we're off the map from tile B, we're going to tile C
      nextPosition = [position[1] - 50, 99];
      nextFacing = Facing.WEST;
    } else if (isInTileC(position)) {
      // Off the left or right side?
      if (position[1] === 50) {
        // Heading off the left, we're going to tile E
        nextPosition = [100, position[0] - 50];
        nextFacing = Facing.SOUTH;
      } else {
        // Heading off the right, we're going to tile B
        nextPosition = [49, position[0] + 50];
        nextFacing = Facing.NORTH;
      }
    } else if (isInTileD(position)) {
      // Off the right side or bottom?
      if (position[1] === 99) {
        // Heading off the right side, we're going to tile B
        nextPosition = [Math.abs(149 - nextPosition[0]), 149];
        nextFacing = Facing.EAST;
      } else {
        // Heading off the bottom, we're going to tile F
        nextPosition = [position[1] + 100, 49];
        nextFacing = Facing.WEST;
      }
    } else if (isInTileE(position)) {
      // If we're off the map from tile E, we're going to tile C
      nextPosition = [position[1] + 50, 50];
      nextFacing = Facing.EAST;
    } else if (isInTileF(position)) {
      // If we're off the map from tile F, we're going to tile D
      nextPosition = [149, position[0] - 100];
      nextFacing = Facing.NORTH;
    }
  }
  // wall check
  if (map[nextPosition[0]][nextPosition[1]] === "#") {
    nextPosition = position;
    nextFacing = facing;
  }
  // console.log(`Next pos: ${nextPosition}`);
  return { nextPosition, nextFacing };
}

const part2 = (rawInput: string) => {
  const { map, directions } = parseInput(rawInput);
  let position = [0, 50];
  let facing: Facing = Facing.EAST;
  const positions = [{ facing: facing.toString(), position: position.toString() }];
  while (directions.length > 0) {
    const direction = directions.pop();
    // console.log(direction);
    if (direction === "R") {
      switch (facing) {
        case Facing.NORTH: facing = Facing.EAST; break;
        case Facing.EAST: facing = Facing.SOUTH; break;
        case Facing.SOUTH: facing = Facing.WEST; break;
        case Facing.WEST: facing = Facing.NORTH; break;
      }
    } else if (direction === "L") {
      switch (facing) {
        case Facing.NORTH: facing = Facing.WEST; break;
        case Facing.EAST: facing = Facing.NORTH; break;
        case Facing.SOUTH: facing = Facing.EAST; break;
        case Facing.WEST: facing = Facing.SOUTH; break;
      }
    } else {
      let stepsLeft = Number(direction);
      while (stepsLeft > 0) {
        let nextPosition;
        let nextFacing;
        switch (facing) {
          case Facing.NORTH: {
            ({ nextPosition, nextFacing } = performCubeMove(position, map, facing, (position: number[]) => [position[0] - 1, position[1]]));
            break;
          }
          case Facing.EAST: {
            ({ nextPosition, nextFacing } = performCubeMove(position, map, facing,(position: number[]) => [position[0], position[1] + 1]));
            break;
          }
          case Facing.SOUTH: {
            ({ nextPosition, nextFacing } = performCubeMove(position, map, facing, (position: number[]) => [position[0] + 1, position[1]]));
            break;
          }
          case Facing.WEST: {
            ({ nextPosition, nextFacing } = performCubeMove(position, map, facing, (position: number[]) => [position[0], position[1] - 1]));
            break;
          }
        }
        if (nextPosition.toString() === position.toString()) {
          stepsLeft = 0;
        }
        if (nextPosition[0] === 0 && nextPosition[1] < 50) throw new Error(`trying to move to ${nextPosition} from ${position}`)
        position = nextPosition;
        positions.push({ facing: facing.toString(), position: position.toString() });
        stepsLeft--;
      }
    }
  }
  // console.log(`${position} - ${facing}`);
  printMap(map, positions);
  return (1000 * (position[0] + 1)) + (4 * (position[1] + 1)) + facing.valueOf();
};

run({
  part1: {
    tests: [
      {
        input: `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
        expected: 6032,
      },
      {
        input: `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

L6R2L2L6L1R8`,
        expected: 6042,
      },
      {
        input: `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

RR1L1R3`,
        expected: 2046,
      },
      {
        input: `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

3R6R2L5L4R1`,
        expected: 9053,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `
//         ...#
//         .#..
//         #...
//         ....
// ...#.......#
// ........#...
// ..#....#....
// ..........#.
//         ...#....
//         .....#..
//         .#......
//         ......#.
//
// 10R5L5R10L4R5L5`,
//         expected: 5031,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
