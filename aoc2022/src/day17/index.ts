import run from "aocrunner";

enum JetDirection {
  LEFT,
  RIGHT
}

const rocks = [
  [['@', '@', '@', '@']],
  [
    ['', '@', ''],
    ['@', '@', '@'],
    ['', '@', ''],
  ],
  [
    ['', '', '@'],
    ['', '', '@'],
    ['@', '@', '@'],
  ],
  [
    ['@'],
    ['@'],
    ['@'],
    ['@'],
  ],
  [
    ['@', '@'],
    ['@', '@'],
  ],
]

const parseInput = (rawInput: string) => {
  return rawInput.split("").map(dir => dir === "<" ? JetDirection.LEFT : JetDirection.RIGHT);
}

const printGrid = (playGrid: string[][], stone: string[][], stoneXStart: number, stoneYStart: number) => {
  const reverseStone = [...stone].reverse();
  let stoneY = 0;
  for (let y = playGrid.length - 1; y >= 0; y--) {
    let lineStr = "";
    let stoneX = 0;
    for (let x = 0; x < playGrid[y].length; x++) {
      // console.log(`sX: ${stoneX}, sY ${stoneY}, stone ${stone}`);
      if (y >= stoneYStart && y < stoneYStart + reverseStone.length && x >= stoneXStart && x < stoneXStart + reverseStone[stoneY].length) {
        const stoneCell = reverseStone[stoneY][stoneX++];
        if (stoneCell !== "") {
          lineStr += stoneCell;
        } else {
          lineStr += playGrid[y][x];
        }
      } else {
        lineStr += playGrid[y][x];
      }
    }
    if (y >= stoneYStart && y < stoneYStart + stone.length) {
      stoneY++;
    }
    console.log(`${y.toString().padStart(2, "0")} |${lineStr}|`);
  }
  console.log("   +-------+");
}

const checkRightMove = (stone: string[][], stoneX: number, stoneY: number, playGrid: string[][]) => {
  if (stoneX + stone[0].length === 7) {
    return false;
  }
  for (let checkY = 0; checkY < stone.length; checkY++) {
    for (let checkX = 0; checkX < stone[checkY].length; checkX++) {
      // console.log(`Checking ${checkX}, ${checkY}. stone is ${stone[checkY][checkX]}.`);
      // console.log(`gridpos is ${stoneY + checkY},${stoneX + checkX + 1} and grid val is ${playGrid[stoneY + checkY][stoneX + checkX + 1]}`);
      if (stone[checkY][checkX] === "@" && playGrid[stoneY + checkY][stoneX + checkX + 1] === "#") {
        return false;
      }
    }
  }
  return true;
}

const checkLeftMove = (stone: string[][], stoneX: number, stoneY: number, playGrid: string[][]) => {
  if (stoneX === 0) {
    return false;
  }
  for (let checkY = 0; checkY < stone.length; checkY++) {
    for (let checkX = 0; checkX < stone[checkY].length; checkX++) {
      // console.log(`Checking ${checkX}, ${checkY}. stone is ${stone[checkY][checkX]}.`);
      // console.log(`gridpos is ${stoneY + checkY},${stoneX + checkX + 1} and grid val is ${playGrid[stoneY + checkY][stoneX + checkX + 1]}`);
      if (playGrid[stoneY + checkY][stoneX + checkX - 1] === "#" && stone[checkY][checkX] === "@") {
        return false;
      }
    }
  }
  return true;
}

const part1 = (rawInput: string) => {
  const gustArray = parseInput(rawInput);

  const playGrid: string[][] = Array.from({length: 5}).map(_ => Array.from({length: 7}).map(_ => '.'));
  let topStoneLine = -1;
  let stoneCount = 1;
  let gustCount = 0;

  while (stoneCount <= 2022) {
    // console.log(`=== Stone ${stoneCount}`);
    const stone = [...rocks[(stoneCount - 1) % 5]].reverse();
    // Expand the grid to make room
    while (playGrid.length < topStoneLine + 4 + stone.length) {
      playGrid.push([...new Array(7).fill('.')]);
    }

    // Insert the new stone
    let stoneX = 2;
    let stoneY = topStoneLine + 4;

    // if (stoneCount === 24) {
    //   printGrid(playGrid, stone, stoneX, stoneY);
    // }

    // Stone moving time
    let stoneDone = false;
    while (!stoneDone) {
      const gust = gustArray[gustCount];
      gustCount = (gustCount + 1) % gustArray.length;
      // console.log(`=== ${gust}, ${gustCount}`)
      switch (gust) {
        case JetDirection.RIGHT: {
          if (checkRightMove(stone, stoneX, stoneY, playGrid)) {
            stoneX++;
          }
          break;
        }
        case JetDirection.LEFT: {
          if (checkLeftMove(stone, stoneX, stoneY, playGrid)) {
            stoneX--;
          }
          break;
        }
      }
      // if (stoneCount === 8) {
      //   printGrid(playGrid, stone, stoneX, stoneY);
      // }

      if (stoneY === 0) {
        stoneDone = true;
        topStoneLine += 1;
        continue;
      } else if (stoneY - 1 <= topStoneLine) {
        for (let checkY = 0; checkY < stone.length; checkY++) {
          for (let checkX = 0; checkX < stone[checkY].length; checkX++) {
            // if (stoneCount === 8) {
            //   console.log(`${playGrid[stoneY - 1 + checkY]}, ${stoneX + checkX}`);
              // console.log(`${stone[checkY][checkX]}`);
            // }

            if (playGrid[stoneY - 1 + checkY][stoneX + checkX] === "#" && stone[checkY][checkX] === "@") {
              // console.log("Hit bottom");
              stoneDone = true;
            }
          }
        }
        if (stoneDone) {
          topStoneLine = Math.max(topStoneLine, stoneY + stone.length - 1);
          // console.log(`TSL is now ${topStoneLine}`)
          continue;
        }
      }

      stoneY--;
      // if (stoneCount === 24) {
      //   printGrid(playGrid, stone, stoneX, stoneY);
      // }
    }

    // Actually insert stone
    const insertX = stoneX;
    const insertY = stoneY;
    stone.forEach((stoneLine, yIndex) => {
      stoneLine.forEach((cell, xIndex) => {
        playGrid[insertY + yIndex][insertX + xIndex] = cell === "@" ? "#" : playGrid[insertY + yIndex][insertX + xIndex];
      });
    })

    // printGrid(playGrid, [], 0, 0);

    if (stoneCount % 100 === 0) {
      console.log(`After ${stoneCount} stones, ${topStoneLine + 1}`);
    }
    stoneCount++;
  }
  // printGrid(playGrid, [], 0, 0);
  console.log(`After ${stoneCount - 1} stones, ${topStoneLine + 1}`);
  return topStoneLine + 1;
};

const part2 = (rawInput: string) => {
  const gustArray = parseInput(rawInput);

  const playGrid: string[][] = Array.from({length: 5}).map(_ => Array.from({length: 7}).map(_ => '.'));
  let topStoneLine = -1;
  let stoneCount = 1;
  let gustCount = 0;

  while (stoneCount <= 2022) {
    // console.log(`=== Stone ${stoneCount}`);
    const stone = [...rocks[(stoneCount - 1) % 5]].reverse();
    // Expand the grid to make room
    while (playGrid.length < topStoneLine + 4 + stone.length) {
      playGrid.push([...new Array(7).fill('.')]);
    }

    // Insert the new stone
    let stoneX = 2;
    let stoneY = topStoneLine + 4;

    // if (stoneCount === 24) {
    //   printGrid(playGrid, stone, stoneX, stoneY);
    // }

    // Stone moving time
    let stoneDone = false;
    while (!stoneDone) {
      const gust = gustArray[gustCount];
      gustCount = (gustCount + 1) % gustArray.length;
      // console.log(`=== ${gust}, ${gustCount}`)
      switch (gust) {
        case JetDirection.RIGHT: {
          if (checkRightMove(stone, stoneX, stoneY, playGrid)) {
            stoneX++;
          }
          break;
        }
        case JetDirection.LEFT: {
          if (checkLeftMove(stone, stoneX, stoneY, playGrid)) {
            stoneX--;
          }
          break;
        }
      }
      // if (stoneCount === 8) {
      //   printGrid(playGrid, stone, stoneX, stoneY);
      // }

      if (stoneY === 0) {
        stoneDone = true;
        topStoneLine += 1;
        continue;
      } else if (stoneY - 1 <= topStoneLine) {
        for (let checkY = 0; checkY < stone.length; checkY++) {
          for (let checkX = 0; checkX < stone[checkY].length; checkX++) {
            // if (stoneCount === 8) {
            //   console.log(`${playGrid[stoneY - 1 + checkY]}, ${stoneX + checkX}`);
            // console.log(`${stone[checkY][checkX]}`);
            // }

            if (playGrid[stoneY - 1 + checkY][stoneX + checkX] === "#" && stone[checkY][checkX] === "@") {
              // console.log("Hit bottom");
              stoneDone = true;
            }
          }
        }
        if (stoneDone) {
          topStoneLine = Math.max(topStoneLine, stoneY + stone.length - 1);
          // console.log(`TSL is now ${topStoneLine}`)
          continue;
        }
      }

      stoneY--;
      // if (stoneCount === 24) {
      //   printGrid(playGrid, stone, stoneX, stoneY);
      // }
    }

    // Actually insert stone
    const insertX = stoneX;
    const insertY = stoneY;
    stone.forEach((stoneLine, yIndex) => {
      stoneLine.forEach((cell, xIndex) => {
        playGrid[insertY + yIndex][insertX + xIndex] = cell === "@" ? "#" : playGrid[insertY + yIndex][insertX + xIndex];
      });
    })

    // printGrid(playGrid, [], 0, 0);

    if (stoneCount % 100 === 0) {
      console.log(`After ${stoneCount} stones, ${topStoneLine + 1}`);
    }
    stoneCount++;
  }
  // printGrid(playGrid, [], 0, 0);
  console.log(`After ${stoneCount - 1} stones, ${topStoneLine + 1}`);
  return topStoneLine + 1;
};

run({
  part1: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
