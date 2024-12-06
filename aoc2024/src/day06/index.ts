import run from "aocrunner";

type Direction = "N" | "E" | "S" | "W";
interface Coordinate { y: number; x: number }
interface GuardCoordinate extends Coordinate { y: number; x: number, direction: Direction }

const parseInput = (rawInput: string) => {
  let guardPosition: GuardCoordinate = { y: 0, x: 0, direction: "N" };
  const blockedPositions = rawInput.split("\n")
    .map((line, y) => {
      return line.split("")
        .map((char, x) => {
          if (char === "^") {
            guardPosition = { y, x, direction: "N" };
          }
          return char === "#" ? { y, x } as Coordinate : null;
        })
        .filter(val => val != null) as Coordinate[];
    }).flat();

  const allPositions = [ ...blockedPositions, guardPosition ];
  const maxY = allPositions.map(pos => pos.y).sort((a, b) => b - a)[0];
  const maxX = allPositions.map(pos => pos.x).sort((a, b) => b - a)[0];

  return { blockedPositions, guardPosition, maxY, maxX };
}

const inBounds = (pos: Coordinate, maxY: number, maxX: number): boolean => {
  return pos.y >= 0 && pos.y <= maxY && pos.x >= 0 && pos.x <= maxX;
}

const turnRight = (direction: Direction): Direction => {
  if (direction === "N") {
    return "E";
  } else if (direction === "E") {
    return "S";
  } else if (direction === "S") {
    return "W";
  } else {
    return "N";
  }
}

function isBlocked(y: number, x: number, blockedPositions: Coordinate[]) {
  return blockedPositions.some(
    (blockedPos) => blockedPos.y === y && blockedPos.x === x,
  );
}

const printGrid = (blockedPositions: Coordinate[], visitedPositions: Coordinate[], maxY: number, maxX: number) => {
  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {

      if (isBlocked(y, x, blockedPositions)) {
        line += "#";
      } else if (visitedPositions.some(visitedPos => visitedPos.y === y && visitedPos.x === x)) {
        line += "X";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

const advanceGuard = (guardPosition: GuardCoordinate, blockedPositions: Coordinate[]): GuardCoordinate => {
  // console.log(`Guard is at { y: ${guardPosition.y}, x: ${guardPosition.x}, direction: ${guardPosition.direction} }`);
  let nextPos = guardStep(guardPosition);

  // console.log(`Guard will try to go to { y: ${nextPos.y}, x: ${nextPos.x}, direction: ${nextPos.direction} }`);
  if (isBlocked(nextPos.y, nextPos.x, blockedPositions)) {
    nextPos = { y: guardPosition.y, x: guardPosition.x, direction: turnRight(guardPosition.direction) }
  }

  return nextPos;
}

const guardStep = (guardPosition: GuardCoordinate): GuardCoordinate => {
  if (guardPosition.direction === "N") {
    return { y: guardPosition.y - 1, x: guardPosition.x, direction: guardPosition.direction };
  } else if (guardPosition.direction === "E") {
    return { y: guardPosition.y, x: guardPosition.x + 1, direction: guardPosition.direction };
  } else if (guardPosition.direction === "S") {
    return { y: guardPosition.y + 1, x: guardPosition.x, direction: guardPosition.direction };
  } else {
    return { y: guardPosition.y, x: guardPosition.x - 1, direction: guardPosition.direction };
  }
}

const part1 = (rawInput: string) => {
  const { blockedPositions, guardPosition: initialGuardPosition, maxY, maxX } = parseInput(rawInput);
  let guardPosition = initialGuardPosition;
  const visitedPositions: Coordinate[] = [];

  while (inBounds(guardPosition, maxY, maxX)) {
    if (!visitedPositions.some(visitedPos => visitedPos.y === guardPosition.y && visitedPos.x === guardPosition.x)) {
      visitedPositions.push(guardPosition);
    }

    guardPosition = advanceGuard(guardPosition, blockedPositions);
  }

  // printGrid(blockedPositions, visitedPositions, maxY, maxX);

  return visitedPositions.length;
};

const runGuardSimulation = (guardPosition: GuardCoordinate, blockedPositions: Coordinate[], visitedPositions: GuardCoordinate[], maxY: number, maxX: number): boolean => {
  while (inBounds(guardPosition, maxY, maxX)) {
    if (visitedPositions.some(visitedPos => visitedPos.y === guardPosition.y && visitedPos.x === guardPosition.x && visitedPos.direction === guardPosition.direction)) {
      return true;
    }

    visitedPositions.push(guardPosition);
    guardPosition = advanceGuard(guardPosition, blockedPositions);
  }
  return false;
}

const part2 = (rawInput: string) => {
  const { blockedPositions, guardPosition: initialGuardPosition, maxY, maxX } = parseInput(rawInput);
  let guardPosition = initialGuardPosition;
  const newBlocks: Coordinate[] = [];
  const triedBlocks: Coordinate[] = [];

  while (inBounds(guardPosition, maxY, maxX)) {
    // Okay this is stupid as hell but we're going to try it?!
    // First, pretend there's an obstacle in our way, and generate the next position.
    const fakeBlock = guardStep(guardPosition);
    // console.log(`Looking to put a fake block at { y: ${fakeBlock.y}, x: ${fakeBlock.x} }`)
    // If it isn't already blocked, run the whole damn simulation with that new block, checking to see if we loop.
    if (!isBlocked(fakeBlock.y, fakeBlock.x, blockedPositions) && !isBlocked(fakeBlock.y, fakeBlock.x, newBlocks) && !isBlocked(fakeBlock.y, fakeBlock.x, triedBlocks)) {
      const fakeBlockedList = [...blockedPositions, fakeBlock];
      const isLoop = runGuardSimulation(initialGuardPosition, fakeBlockedList, [], maxY, maxX);
      if (isLoop) {
        // console.log(`WE GOT ONE!!!!!! Fake block goes at: { y: ${fakeBlock.y}, x: ${fakeBlock.x} }`);
        newBlocks.push(fakeBlock);
      } else {
        triedBlocks.push(fakeBlock);
      }
    }

    guardPosition = advanceGuard(guardPosition, blockedPositions);
  }

  // printGrid(blockedPositions, visitedPositions, maxY, maxX);
  return newBlocks.length;
};

run({
  part1: {
    tests: [
      {
        input: `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 41,
      },
    ],
    // 82? wtf?
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
    ],
    // 1826 too high
    // 1792 too high
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
