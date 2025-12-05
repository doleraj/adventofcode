import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const chunks = rawInput.split("\n\n");

  const order = chunks[0].split(",").map(n => Number.parseInt(n));
  const boards = chunks.slice(1).map(board => board.split("\n").map(line => {
    const match = line.match(/\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
    return [ Number.parseInt(<string>match?.[1]), Number.parseInt(<string>match?.[2]), Number.parseInt(<string>match?.[3]), Number.parseInt(<string>match?.[4]), Number.parseInt(<string>match?.[5]) ]
  }));
  return { order, boards };
}

const isBoardAWinner = (board: number[][]) => {

  for (let row = 0; row < board.length; row++) {
    if (board[row].map(c => c.toString()).join(",") === "-1,-1,-1,-1,-1") {
      return true;
    }
  }

  for (let col = 0; col < board[0].length; col ++) {
    if (board[0][col] === -1 && board[1][col] === -1 && board[2][col] === -1 && board[3][col] ===-1 && board[4][col] === -1) {
      return true;
    }
  }
  return false;
};

const part1 = (rawInput: string) => {
  const { order, boards: firstBoards } = parseInput(rawInput);

  let boards = firstBoards.slice();
  let nextBoards: number[][][] = [];
  for (const num of order) {

    for (const board of boards) {
      const nextBoard = board.map(line => line.map(c => c === num ? -1 : c));

      if (isBoardAWinner(nextBoard)) {

        return num * nextBoard.reduce((acc, line) => {
          return acc + line.reduce((lineAcc, cell) => lineAcc + Math.max(0, cell), 0)
        }, 0);
      }
      nextBoards.push(nextBoard);
    }

    boards = nextBoards;
    nextBoards = [];
  }

  return;
};

const part2 = (rawInput: string) => {
  const { order, boards: firstBoards } = parseInput(rawInput);

  let boards = firstBoards.slice();
  let nextBoards: number[][][] = [];
  let latestWinScore = 0;
  let numBoardsThatWon = 0;
  for (const num of order) {

    for (const board of boards) {

      const nextBoard = board.map(line => line.map(c => c === num ? -1 : c));

      if (isBoardAWinner(nextBoard)) {
        latestWinScore = num * nextBoard.reduce((acc, line) => {
          return acc + line.reduce((lineAcc, cell) => lineAcc + Math.max(0, cell), 0)
        }, 0);
        numBoardsThatWon++;
      } else {
        nextBoards.push(nextBoard);
      }
    }

    boards = nextBoards;
    nextBoards = [];
  }

  return latestWinScore;
};

run({
  part1: {
    tests: [
      {
        input: `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
