import run from "aocrunner";
import { toSetToken } from "../utils/index.js";

type Seat = { y: number, x: number, filled: boolean };

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .reduce((acc, line, y) => {
    return line
      .split("")
      .reduce((acc, char, x) => {
        if (char === "L") {
          const seat = { y, x, filled: false };
          acc[toSetToken(seat)] = seat;
        }
        return acc;
      }, acc);
  }, {} as Record<string, Seat>);
}

const part1 = (rawInput: string) => {
  let seats = parseInput(rawInput);

  let seatsChanged = -1;
  while (seatsChanged === -1 || seatsChanged > 0) {
    const nextSeats: Seat[] = [];
    const seatList = Object.values(seats);
    for (let seat of seatList) {
      const adjacentSeats = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]].map(c => {
        return seats[toSetToken({ y: seat.y + c[0], x: seat.x + c[1] })];
          // .find(a => a.y === seat.y + c[0] && a.x === seat.x + c[1] && a.filled);
      }).filter(v => v !== undefined) as Seat[];
      const filledSeatCount = adjacentSeats.filter(s => s.filled).length;

      if (!seat.filled && filledSeatCount === 0) {
        nextSeats.push({ y: seat.y, x: seat.x, filled: true });
      } else if (seat.filled && filledSeatCount >= 4) {
        nextSeats.push({ y: seat.y, x: seat.x, filled: false });
      }
    }
    seatsChanged = nextSeats.length;
    nextSeats.forEach(nextSeat => seats[toSetToken(nextSeat)] = nextSeat);
  }

  return Object.values(seats).filter(s => s.filled).length;
};

const printGrid = (seats: Record<string, Seat>, maxX: number, maxY: number) => {
  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      const seat = seats[toSetToken({ y, x })]
      if (!seat) {
        line += "."
      } else if (seat.filled) {
        line += "#"
      } else {
        line += "L"
      }
    }
    console.log(line);
  }
}

const part2 = (rawInput: string) => {
  let seats = parseInput(rawInput);
  const maxY = Math.max(...Object.values(seats).map(s => s.y));
  const maxX = Math.max(...Object.values(seats).map(s => s.x));

  let seatsChanged = -1;
  while (seatsChanged === -1 || seatsChanged > 0) {
    const nextSeats: Seat[] = [];
    const seatList = Object.values(seats);
    for (let seat of seatList) {
      const adjacentSeats = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]].map(c => {
        let nextSeat = { y: seat.y + c[0], x: seat.x + c[1] };

        while (seats[toSetToken(nextSeat)] === undefined
          && nextSeat.y >= 0 && nextSeat.y <= maxY && nextSeat.x >= 0 && nextSeat.x <= maxX) {
          nextSeat.y += c[0];
          nextSeat.x += c[1];
        }

        return seats[toSetToken(nextSeat)];
        // .find(a => a.y === seat.y + c[0] && a.x === seat.x + c[1] && a.filled);
      }).filter(v => v !== undefined) as Seat[];
      // console.log(adjacentSeats);
      // return 0;

      const filledSeatCount = adjacentSeats.filter(s => s.filled).length;

      if (!seat.filled && filledSeatCount === 0) {
        nextSeats.push({ y: seat.y, x: seat.x, filled: true });
      } else if (seat.filled && filledSeatCount >= 5) {
        nextSeats.push({ y: seat.y, x: seat.x, filled: false });
      }
    }
    seatsChanged = nextSeats.length;
    nextSeats.forEach(nextSeat => seats[toSetToken(nextSeat)] = nextSeat);
    // printGrid(seats, maxX, maxY);
    console.log(seatsChanged)
  }

  return Object.values(seats).filter(s => s.filled).length;
};

run({
  part1: {
    tests: [
      {
        input: `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`,
        expected: 37,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false
});
