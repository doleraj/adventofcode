import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => {
  const initialSplits = line.split(":");
  const gameNumber = Number.parseInt(initialSplits[0].match(/(\d+)/)!![0]);
  const numberSplits = initialSplits[1]!!.split("|");

  const winningNumbers = Array.from(numberSplits[0].matchAll(/\s+(\d+)/g)!!).map(match => Number.parseInt(match[1]));
  const playedNumbers = Array.from(numberSplits[1].matchAll(/\s+(\d+)/g)!!).map(match => Number.parseInt(match[1]));
  return { gameNumber, winningNumbers, playedNumbers };
});

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const gameScores = input.map(game => {
    return game.playedNumbers.reduce((accum, currentValue) => {
      if (game.winningNumbers.includes(currentValue)) {
        return accum + 1;
      }
      return accum;
    }, 0);
  }).map(wins => wins ? Math.pow(2, wins - 1) : 0);

  return gameScores.reduce((accum, score) => accum + score, 0);
};

interface Game {
  gameNumber: number;
  // winningNumbers: number[];
  // playedNumbers: number[];
  numberOfPlays: number;
  ticketsIfWon: number[];
}

const part2 = (rawInput: string) => {
  const games = parseInput(rawInput);
  const maxGameNumber = Math.max(...games.map(game => game.gameNumber));
  const gamesMap: Map<number, Game> = games.reduce((accum, game) => {
    const wins = game.playedNumbers.reduce((accum, currentValue) => {
      if (game.winningNumbers.includes(currentValue)) {
        return accum + 1;
      }
      return accum;
    }, 0);

    accum.set(game.gameNumber, {
      gameNumber: game.gameNumber,
      numberOfPlays: 1,
      // This is dumb as hell but I love it.
      ticketsIfWon: [...Array(wins).keys()].map(val => val + 1 + game.gameNumber).filter(ticket => ticket <= maxGameNumber),
    });
    return accum;
  }, new Map());

  let totalTickets = 0;
  for (const [gameNumber, game] of gamesMap) {
    for (let i = 0; i < game.numberOfPlays; i++) {
      totalTickets++;
      game.ticketsIfWon.forEach(bonusGameNumber => gamesMap.get(bonusGameNumber)!!.numberOfPlays++) ;
    }
  }

  return totalTickets;
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
