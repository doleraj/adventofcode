import run from "aocrunner";

type Coordinate = { y: number; x: number };
type Move = "^" | ">" | "v" | "<";

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");

  let robot: Coordinate = { y: -1, x: -1 }
  const boxes: Coordinate[] = [];
  const obstacles: Coordinate[] = [];
  parts[0].split("\n").forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "@") {
        robot = { y, x };
      } else if (char === "O") {
        boxes.push({ y, x });
      } else if (char === "#") {
        obstacles.push({ y, x });
      }
    });
  })

  const moves = parts[1].split("\n").map(line => line.split("")).flat() as Move[];
  return { robot, boxes, obstacles, moves };
}

const moveThingTo = (thing: Coordinate, move: Move, boxes: Coordinate[], obstacles: Coordinate[]) => {
  let newPosition: Coordinate;
  if (move === "^") {
    newPosition = { y: thing.y - 1, x: thing.x };
  } else if (move === ">") {
    newPosition = { y: thing.y, x: thing.x + 1 };
  } else if (move === "<") {
    newPosition = { y: thing.y, x: thing.x - 1 };
  } else {
    newPosition = { y: thing.y + 1, x: thing.x };
  }

  if (obstacles.filter(obs => obs.y === newPosition.y && obs.x === newPosition.x).length > 0) {
    return false;
  }

  const boxInWay = boxes.find(box => box.y === newPosition.y && box.x === newPosition.x);
  if (boxInWay) {
    if (!moveThingTo(boxInWay, move, boxes, obstacles)) {
      return false;
    }
  }

  thing.y = newPosition.y;
  thing.x = newPosition.x;
  return true;
}

const part1 = (rawInput: string) => {
  const { robot, boxes, obstacles, moves } = parseInput(rawInput);

  moves.forEach(move => {
    moveThingTo(robot, move, boxes, obstacles);
  });

  return boxes.reduce((sum, box) => {
    return sum + (box.y * 100) + box.x;
  },0);
};

const printGrid = (robot: Coordinate, obstacles: Coordinate[], boxes: Coordinate[][]) => {
  for (let y = 0; y < 10; y++) {
    let line = "";
    for (let x = 0; x < 20; x++) {
      if (robot.y === y && robot.x === x) {
        line += "@";
      } else if (obstacles.filter(obs => obs.y === y && obs.x === x).length > 0) {
        line += "#";
      } else if (boxes.filter(box => box[0].y === y && box[0].x === x).length > 0) {
        line += "[";
      } else if (boxes.filter(box => box[1].y === y && box[1].x === x).length > 0) {
        line += "]";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

type Result = { valid: boolean, doThing: () => void }

const moveMoreComplicatedThingTo = (thing: Coordinate[], move: Move, boxes: Coordinate[][], obstacles: Coordinate[]): Result[] => {
  let newPositions: Coordinate[];
  if (move === "^") {
    newPositions = thing.map(thingPart => ({ y: thingPart.y - 1, x: thingPart.x }));
  } else if (move === ">") {
    newPositions = thing.map(thingPart => ({ y: thingPart.y, x: thingPart.x + 1 }));
  } else if (move === "<") {
    newPositions = thing.map(thingPart => ({ y: thingPart.y, x: thingPart.x - 1 }));
  } else {
    newPositions = thing.map(thingPart => ({ y: thingPart.y + 1, x: thingPart.x }));
  }

  const obstaclesBlock = newPositions.some(newPos => {
    return obstacles.filter(obs => (obs.y === newPos.y && obs.x === newPos.x)).length > 0
  });
  if (obstaclesBlock) {
    return [{ valid: false, doThing: () => {} }];
  }

  const boxesInWay = boxes
    .filter((box) => {
      if (newPositions.length === 1) {
        return true;
      } else {
        return !(box[0].y === thing[0].y && box[0].x === thing[0].x
          && box[1].y === thing[1].y && box[1].x === thing[1].x)
      }
    })
    .filter((box) => {
      return newPositions.some((newPos) => {
        // console.log(`Checking %o against %o, result %o`, newPos, box, (box[0].y === newPos.y && box[0].x === newPos.x) || (box[1].y === newPos.y && box[1].x === newPos.x));
        return (box[0].y === newPos.y && box[0].x === newPos.x) || (box[1].y === newPos.y && box[1].x === newPos.x);
      });
    });

  const childThingDoers: Result[] = [];
  if (boxesInWay) {
    const results = boxesInWay.flatMap(boxInWay => {
      return moveMoreComplicatedThingTo(boxInWay, move, boxes, obstacles);
    });

    if (!results.every(result => result.valid)) {
      return [{ valid: false, doThing: () => {} }];
    }

    childThingDoers.push(...results);
  }

  return [...childThingDoers, { valid: true, doThing: () => {
    thing.forEach((thingPart, idx) => {
      thingPart.y = newPositions[idx].y;
      thingPart.x = newPositions[idx].x;
    });
      // console.log(`Thing is now %o`, thing)
    } }];
}

const part2 = (rawInput: string) => {
  const { robot: oldRobot, boxes: oldBoxes, obstacles: oldObstacles, moves } = parseInput(rawInput);

  const robot = { y: oldRobot.y, x: oldRobot.x * 2 };

  const obstacles = oldObstacles
    .map((obstacle) => [{ y: obstacle.y, x: obstacle.x * 2 }, { y: obstacle.y, x: obstacle.x * 2 + 1 }]).flat();

  const boxes = oldBoxes
    .map((box) => [{ y: box.y, x: box.x * 2 }, { y: box.y, x: box.x * 2 + 1 }]);

  // printGrid(robot, obstacles, boxes)

  moves.forEach(move => {
    const results = moveMoreComplicatedThingTo([robot], move, boxes, obstacles);
    if (results.every(result => result.valid)) {
      results.forEach(result => result.doThing());
    }
    // printGrid(robot, obstacles, boxes)
  });

  return boxes.reduce((sum, box) => {
    return sum + (box[0].y * 100) + box[0].x;
  }, 0);
};


run({
  part1: {
    tests: [
      {
        input: `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
        expected: 2028,
      },
      {
        input: `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`,
        expected: 10092,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
        `,
        expected: 618,
      },
      {
        input: `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
        `,
        expected: 9021,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
