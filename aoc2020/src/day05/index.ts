import run from "aocrunner";
import exp from "node:constants";

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => {
  const chars = line.split("");
  return { rowIndicators: chars.slice(0, 7), columnIndicators: chars.slice(7) };
});

const findSeatNumber = (boardingPass: { rowIndicators: string[], columnIndicators: string[] }) => {
  let minRow = 0;
  let maxRow = 127;
  for (let i = 0; i < 6; i++) {
    let half = minRow + Math.round((maxRow - minRow) / 2);

    if (boardingPass.rowIndicators[i] === "F") {
      maxRow = half - 1;
    } else {
      minRow = half;
    }
    // console.log(`Found ${boardingPass.rowIndicators[i]}, setting minmax to: ${minRow}, ${maxRow}` );
  }
  const row = boardingPass.rowIndicators[6] === "F" ? minRow : maxRow;

  let minCol = 0;
  let maxCol = 7;
  for (let i = 0; i < 2; i++) {
    let half = minCol + Math.round((maxCol - minCol) / 2);

    if (boardingPass.columnIndicators[i] === "L") {
      maxCol = half - 1;
    } else {
      minCol = half;
    }
    // console.log(`Found ${boardingPass.columnIndicators[i]}, setting minmax to: ${minCol}, ${maxCol}` );
  }
  const col = boardingPass.columnIndicators[2] === "L" ? minCol : maxCol;
  return row * 8 + col;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((highestSeatId, boardingPass) => {
    const seatId = findSeatNumber(boardingPass);
    return Math.max(highestSeatId, seatId);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const seatIds = input.map(boardingPass => {
    return findSeatNumber(boardingPass);
  });

  const minSeat =  Math.min(...seatIds);
  const maxSeat =  Math.max(...seatIds);
  const expectedIds = Array(maxSeat - minSeat).fill(0).map((x, i) => i + minSeat);

  for (let seatId of expectedIds) {
    if (!seatIds.includes(seatId)) {
      return seatId;
    }
  }

  return;
};

run({
  part1: {
    tests: [
      {
        input: `FBFBBFFRLR`,
        expected: 357,
      },
      {
        input: `BFFFBBFRRR`,
        expected: 567,
      },
      {
        input: `FFFBBBFRRR`,
        expected: 119,
      },
      {
        input: `BBFFBBFRLL`,
        expected: 820,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
