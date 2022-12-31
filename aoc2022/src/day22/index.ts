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
  // console.log(`Checking ${position}, ${nextPosition}`);
  // wrap check
  if (nextPosition[0] < 0) {
    if (isInTileA(position)) {
      // North of tile A is tile F
      nextPosition = [nextPosition[1] + 100, 0];
      nextFacing = Facing.EAST;
      // console.log(`I think we're in tile A, moving to F, nextPos ${nextPosition} with new facing ${nextFacing}`);
    } else if (isInTileB(position)) {
      // North of tile B is also tile F
      nextPosition = [199, nextPosition[1] - 100];
      nextFacing = facing;
      // console.log(`I think we're in tile B, moving to F, nextPos ${nextPosition} with new facing ${nextFacing}`);
    }
  } else if (nextPosition[1] < 0) {
    if (isInTileE(position)) {
      // West of tile E is tile A
      nextPosition = [Math.abs(149 - nextPosition[0]), 50];
      nextFacing = Facing.EAST;
      // console.log(`I think we're in tile E, moving to A, nextPos ${nextPosition} with new facing ${nextFacing}`);
    } else if (isInTileF(position)) {
      // West of tile F is also tile A
      nextPosition = [0, nextPosition[0] - 100];
      nextFacing = Facing.SOUTH;
      // console.log(`I think we're in tile F, moving to A, nextPos ${nextPosition} with new facing ${nextFacing}`);
    }

    // nextPosition[1] = map[nextPosition[0]].length - 1;
  } else if (nextPosition[0] >= map.length) {
    // Has to be tile F, south of that is tile B
    nextPosition = [0, nextPosition[1] + 100];
    nextFacing = facing;
    // console.log(`I think we're in tile F, moving to B, nextPos ${nextPosition} with new facing ${nextFacing}`);
  } else if (nextPosition[1] >= map[nextPosition[0]].length) {
    // Has to be tile B, east of that is tile D
    nextPosition = [Math.abs(149 - nextPosition[0]), 99];
    nextFacing = Facing.WEST;
    // console.log(`I think we're in tile B, moving to D, nextPos ${nextPosition} with new facing ${nextFacing}`);
  }
  // console.log(`after bounds checking ${nextPosition} ${nextFacing}`)

  if (map[nextPosition[0]][nextPosition[1]] === " ") {
    // console.log('empty');
    if (isInTileA(position)) {
      // If we're off the map from tile A, we're going to tile E
      nextPosition = [Math.abs(149 - nextPosition[0]), 0];
      nextFacing = Facing.EAST;
      // console.log(`I think we're in tile A, moving to E, nextPos ${nextPosition} with new facing ${nextFacing}`);
    } else if (isInTileB(position)) {
      // If we're off the map from tile B, we're going to tile C
      nextPosition = [position[1] - 50, 99];
      nextFacing = Facing.WEST;
      // console.log(`I think we're in tile B, moving to C, nextPos ${nextPosition} with new facing ${nextFacing}`);
    } else if (isInTileC(position)) {
      // Off the left or right side?
      if (position[1] === 50) {
        // Heading off the left, we're going to tile E
        nextPosition = [100, position[0] - 50];
        nextFacing = Facing.SOUTH;
        // console.log(`I think we're in tile C, moving to E, nextPos ${nextPosition} with new facing ${nextFacing}`);
      } else {
        // Heading off the right, we're going to tile B
        nextPosition = [49, position[0] + 50];
        nextFacing = Facing.NORTH;
        // console.log(`I think we're in tile C, moving to B, nextPos ${nextPosition} with new facing ${nextFacing}`);
      }
    } else if (isInTileD(position)) {
      // Off the right side or bottom?
      if (position[1] === 99) {
        // Heading off the right side, we're going to tile B
        nextPosition = [Math.abs(149 - nextPosition[0]), 149];
        nextFacing = Facing.WEST;
        // console.log(`I think we're in tile D, moving to B, nextPos ${nextPosition} with new facing ${nextFacing}`);
      } else {
        // Heading off the bottom, we're going to tile F
        nextPosition = [position[1] + 100, 49];
        nextFacing = Facing.WEST;
        // console.log(`I think we're in tile D, moving to F, nextPos ${nextPosition} with new facing ${nextFacing}`);
      }
    } else if (isInTileE(position)) {
      // If we're off the map from tile E, we're going to tile C
      nextPosition = [position[1] + 50, 50];
      nextFacing = Facing.EAST;
      // console.log(`I think we're in tile E, moving to C, nextPos ${nextPosition} with new facing ${nextFacing}`);
    } else if (isInTileF(position)) {
      // If we're off the map from tile F, we're going to tile D
      nextPosition = [149, position[0] - 100];
      nextFacing = Facing.NORTH;
      // console.log(`I think we're in tile F, moving to D, nextPos ${nextPosition} with new facing ${nextFacing}`);
    }
  }
  // wall check
  if (map[nextPosition[0]][nextPosition[1]] === "#") {
    // console.log("rock");
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
  let cmd = 0;
  const positions = [{ facing: facing.toString(), position: position.toString() }];
  while (directions.length > 0 && cmd < 7) {
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
        // if (nextPosition[0] === 0 && nextPosition[1] < 50) {
        //   throw new Error(`trying to move to ${nextPosition} from ${position}`);
        // }
        position = nextPosition;
        facing = nextFacing;
        positions.push({ facing: facing.toString(), position: position.toString() });
        stepsLeft--;
      }
    }

    // console.log(`After cmd ${cmd++}`)
    // printMap(map, positions);
  }
  // console.log(`${position} - ${facing}`);
  // printMap(map, positions);
  return (1000 * (position[0] + 1)) + (4 * (position[1] + 1)) + facing.valueOf();
  // 129132 too high, 47237 too high
};

const baseInput = `                                                  
                                                  .......#..............................................#.#..#.#..#.....#.........#.....#.............
                                                  ......................#..........................#.#.....................##.........................
                                                  ......#...#.#...........#...#..........#...........#.........................#..........#..#........
                                                  ..........#.....#.....##..#..#..............#....#..........................##.#..#......#.....##...
                                                  .......#....#...#.......#..#......#...#..........#...........................####...................
                                                  ...#.....#....#............#..#.#.....#.#................#..#........#.........#....................
                                                  ..............#...#....#....................#.#....#.##....#...#.#.#...#..........#....#............
                                                  ...........#........#.#......#.#..............................#.............#.............#....#....
                                                  ............#.........##..........##.#....##........#.......#.#.......................#...#...#.....
                                                  ...................#......#........#......#.......#....#...............................#...#......#.
                                                  ....#........................................#..#................##...........#.........#...##......
                                                  ..........................#...................#.......#.......##...#.......#...#........#...........
                                                  ........#....#...##...#.......#.....##...#..............#.................#..#.........#........#...
                                                  ..................#..........#...#...#..#...........................##...##.....#...................
                                                  ...#......#....#......#.............#.....#...........#...........................................#.
                                                  ...................#..........#..#.......#........#........#.#.....#...#............................
                                                  ..#.....................#..#....#.......#......#.................................#..............#...
                                                  ............#...........#..#..........#...........##...................#..#.............#.....#.#...
                                                  ..............##.........#.#........#.............#...#..........#.........................#.#....#.
                                                  .#............##................................#.......#......#...##...#.............#.............
                                                  ...............#............#...........#.#.............#..........................##...#...........
                                                  ...#.#...........#.......#..#............#.....#.......#....#.....#...#.........#.#.....#..........#
                                                  .#.....................#..#...........#............#........#........#....#.#.......................
                                                  ..#.......................................#...........#....#......................#..............#..
                                                  ..#..........#..#...........#..........................#..........#.........#....#......#..........#
                                                  .....#........................#......................#.#..#........#................................
                                                  #...#..................#....#..............................#......#.....................#.#.........
                                                  ...........#.............#...##..........#.......................#..#....#...#.....#..#.........#..#
                                                  .#..#..#.............##..#..............##.....#.............#......##..#.##...............#........
                                                  ........#...#...............#....#.#..........#..#........#..#..#......#.....#......................
                                                  ......................#...............#...............#............#....#....#.#....................
                                                  .#.....#.............#................................#.............................#.....#...#....#
                                                  .........#.##........#.#..#.....##.........................##..........................#............
                                                  ....#.........................#........#...........#..#....................#......#..#..........#...
                                                  ..........#...#.##...........................................................##......#..............
                                                  ...#..........#....#....#..#.....#....#...#..#....#..............#..........................#.#.....
                                                  .#.......#.#.....................#...........#..................................#.....#.......#....#
                                                  .........##.........................#...#......#....#............................#....#.............
                                                  ..................#........#.....#...............#........#.....#...................#...#........#..
                                                  ...............#........#...........#....#................#..........##......#.#....................
                                                  ....#.............#............#.........#...........................................#......#...#..#
                                                  ...............##...#.##.#.............#...#.......#..#..#...#..#...........#.....##.##...#........#
                                                  #........#...##................................##..#....................#.#.......................#.
                                                  ....#.#.......#..........#.............#.#............#........#.....##.#........#..................
                                                  ......#................##.....#.............#..#.....#.#..........#...##....#....................#..
                                                  ...###...............................#..................#.#..........#...........................#..
                                                  ...#.........#......#.#....#...........#.....#.......................#.#...#......#................#
                                                  .....#..#.#..#............#.....#........................#....#.................#..........#.....#..
                                                  ...#...........#.....#...........#.#..#....#.#...##.#......#.#.....#....#........#..................
                                                  ..#......#.#...##............#............................#.....#...........#.....................#.
                                                  ..#..............#........................##.#....
                                                  ....#............#...#....#..#....#.........#.....
                                                  ...#........#.#.#................#...............#
                                                  .#..#.........................#....#.#.....#......
                                                  ....#..........#....................#.#.##........
                                                  ....#.......#..#........................#.........
                                                  ..............#......#.........#...........#......
                                                  #......#.#............#....................#...#..
                                                  #..........#.....#................................
                                                  ..#.......##...#............................#.....
                                                  ..##........#..........#...##.........#..........#
                                                  ................#....#........#.....#.............
                                                  ....#..#.............#.............#..............
                                                  ..#.........#.......#...##.....#.......#...#......
                                                  ..........#.................#......#...#..........
                                                  ..........................#.......................
                                                  ...#...#.........#.....#.......#............#.....
                                                  ............................#..........##........#
                                                  ....#...................#.......................#.
                                                  ...#.....#.....#........................#.........
                                                  ...................................#......#.#.....
                                                  .......##.#...........###........................#
                                                  ...#.............#.#..........#............#......
                                                  ................#..#.....#.............#..........
                                                  .#......##.#......#.#..#.......................#..
                                                  .#...........#............#....#..................
                                                  ......#...#.#............#...#...#...#............
                                                  ...........##.......##.......#....................
                                                  #..........#......#..................#............
                                                  ......#..................#..........#............#
                                                  ......................#........#..........#.......
                                                  .......#......#.................#.................
                                                  ...................#.#.........#..........#.......
                                                  .......#.#..........................#..#..........
                                                  .......#..........#...............................
                                                  ..................#.........#................##..#
                                                  ##..........#.......#.........#...#......#........
                                                  ..................#.........#.....................
                                                  .....#......#................#....................
                                                  ...............................#..#......#........
                                                  ..........................#....#..................
                                                  .....#..#..#..........#......#....................
                                                  ........##...#..#......#..#...............#.......
                                                  ##.......#..........#...#..........##......#......
                                                  #.............#...............................#...
                                                  .#.............#..................................
                                                  ..................................................
                                                  .#...#...#..#.............#.....#......#..........
                                                  .#..#.....#..............#.##....#................
                                                  ...................#.#.........#..................
..#..##......##.#........#.#....#.......#................#..........................................
.....#.......#.......#........#.#.....#.............#..............#..............#.................
..........#....#...#...........................##...............................##.#...............#
..........#.............#.................##..............#.................................#.......
.#..#.............................................#...##..#.....#.......#.#..##...#.................
##.##...................................#...................................#.............#.........
....#.........#.........#............#..#.........#...........#..............#..........#......#....
.....................#...#........................#...........#.....#...............................
...#......#.....#....#.....#..........#.........................##.#........#.......................
.#.......#.......................##...................#.#..#...#.......................##...........
.#...........#.............#...#......................#..#...........#.....#........#......#........
....................#....##...#...............##.#....#.....................#.#...............#.....
.......#..#..#.....#...........#......#...........................#..............#...#......#.......
.....#.......#...................##..............................#...............#................#.
...#...........#...........##.#.......#....##..............#.##...............#.......#...#.#......#
...............#.........#....##........#....##.......#...................##.................#...#..
...........#.............#.........#..#.#..........#...#.....#............#.........................
...................#......#.................#....................#...#...#...............#..#.......
....#.........................................##...#..#.....................#....#..................
.................#...#.....#........................#........#.......#........#.....................
.............#........................#.#.....................#..........#..............#....#.#....
..#........#.#...............#..#.....#...#...............#..#........................#.#....#......
#......#........#....#.....#.#..........##.....#.....#..........................##..#.#.#........#.#
.......#.....#..#...........#..#.#....#.......#...........#...........#..................#..........
..............#............................................................#...#.....##......#......
..#....................................#..........#.#....##.....#...#...........#.....#.............
..................#...#.....................#.#.#..#..............#..#.....#...........#.....#...#..
.#.#..#.....##...........#.................#.........#.......................#.#...#.#.....#........
.....#...........................#.............#.....#.............#.....................#.......#..
....#..#...#............#.............#..#..#......#...#.................#....#....###..............
.........#.....#....#........#........#....##...#.......#...#.....#........#............#...........
##.....#...#.##................##........#......#........................#..#.....#.........#.......
........................#...........#.............................#.....#..#.................#......
.............#..#.....#..................#............#.........................#...................
............#..............#.#..#.....................#........................#..#.......#......#..
.............##........#.#......#....#.....................##.................#..#..##...........#..
......................#..................#.......................#....#.................#...........
#.....#.......#............#......#..#...#....#.#.............#.................#.....#.............
...#.......#.........................#...........##..........#..................#..#.......#.....#..
..#.#.#..............#....#..#..........................................#.#..........#.....#........
.....#..................#.#............#........................................#....#..............
.#.....#........#................................#..#...................##.#......#.................
##............#......#.#...##.............................#.......#........#........................
...............#..#......#.......#....#....................................#......#...........#....#
...........#..........#......#...#....#.....#....#..............#............#.............#........
...............#...........#....#.......................#...#...............................#.......
........#........#......#...#.................#..#..................#..................#............
...#.........#................#.....................#..##...................#....##............#.#..
...........#....#.#.....##......................#..#......#.........#...#...........................
.....###.........#................#............#...#.............................#.....#..#.......#.
.......#.......#.........#....#....##.............
.............#..##.#.......#.....#...#.........#.#
.#................#..#........#...............#..#
.....#.......#...........#.....#.....#......#.....
.#.#......#..#..........#.....#...#.#.............
.......##....#............#..#..............#.....
.#.........#..........#.......#........#..........
...#.....#.#.#..........##...................#....
.#..#..#..#...#.#....#.......#.................#..
........#......#......#..#..#.....#.....#..#......
..................................................
..................................................
.#..#.............#.........#....#..###...........
#.#....#......................#.#....#...........#
..................#..................#....#.......
...........#.........#....#..#...#................
#...........#..........#............#....#.#......
.#....##.....#......#.............................
....#.....#........#......#..#................#.#.
...#............#....#.#........................#.
..#..................#............................
....#.....#.................#......##.............
......................#...........................
#......#.#........#...........#.....#.............
...#................#............#..#..#......#..#
..............##................#.#......##.......
.................#....#.#.#..#.......#........#...
.......#........#......##...........#......#......
.#...............#....#...........#.#.............
....#..............##.#.....#....#.#...........#..
.......................##.....#...#..............#
..#..............................#.....#.......#..
...#......##..#...#........#..#...................
#.................................................
........#.................#...#.........##........
#..............................#..#...............
........#..#...#.....##.#........#....#..........#
#...#......#...............#..................#...
....................#.....#...................#...
.......#.......####...............................
.##...........#......#.........##.................
.#..#.............#.#...................#..##.....
........#...#...#........#.....##.................
.....#....................#.......................
......................#...........................
..........#.....#........##....#....#.............
........#............#................#...........
..#....................................#........#.
..............##.#......#...............##.#.#....
....#...#.#.#.................##.............#....`;


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
      // A moving to F
      {
        input: baseInput + `

3L2`,
        expected: 154008,
      },
      // A moving to E
      {
        input: baseInput + `

LL2`,
        expected: 150008,
      },
      // B moving to F
      {
        input: baseInput + `

6R1L2L1R45L3`,
        expected: 198019,
      },
      // B moving to D
      {
        input: baseInput + `

6R1L2L1R45R1L19L1R7R1L21`,
        expected: 149402,
      },
      // C moving to B
      {
        input: baseInput + `

5R20L1R22L1R14L6R1L8R1L28R1L1`,
        expected: 50443,
      },
      // C moving to E
      {
        input: baseInput + `

5R20L1R22L1R14R7R2L1`,
        expected: 101021,
      },
      // D moving to F
      {
        input: baseInput + `

5R20L1R22L1R14R2L31R2L34L3R8L1R21`,
        expected: 158202,
      },
      // B moving to D and back to B
      {
        input: baseInput + `

6R1L2L1R45R1L19L1R7R1L21L1L1`,
        expected: 1602,
      },
      // A moving to E then C
      {
        input: baseInput + `

LL3L9L1R8R1L6R1L12L1R40L1R3`,
        expected: 52208,
      },
      // A moving to E then A
      {
        input: baseInput + `

LL2L1L3`,
        expected: 2208,
      },
      // A moving to F then A
      {
        input: baseInput + `

3L3R2R4`,
        expected: 2225,
      },
      // A moving to F then B
      {
        input: baseInput + `

3L3R9L1R6R2L9L2R4L2R11R2L10`,
        expected: 3417,
      },
      // A moving to F then D
      {
        input: baseInput + `

3L3R9L1R6R2L9L2R4L2R2L45`,
        expected: 150339,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
