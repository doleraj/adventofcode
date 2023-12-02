import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const bagMaxReds = 12;
  const bagMaxGreens = 13;
  const bagMaxBlues = 14;

  const maxPullsFromGames = input.map(line => {
    const initial = line.match(/Game (\d+): (.*)/)!!;
    const gameNumber = initial[1];
    // console.log(`********************** GAME ${gameNumber}`);

    const pulls = initial[2].split(";");
    const maxFromPulls = pulls.map(pull => {
      const reds = Number.parseInt(pull.match(/(\d+) red/)?.[1] || "0");
      const blues = Number.parseInt(pull.match(/(\d+) blue/)?.[1] || "0");
      const greens = Number.parseInt(pull.match(/(\d+) green/)?.[1] || "0");

      return {
        reds,
        blues,
        greens,
      }
    }).reduce((previousValue, currentValue) => {
      return {
        reds: Math.max(currentValue.reds, previousValue.reds),
        blues: Math.max(currentValue.blues, previousValue.blues),
        greens: Math.max(currentValue.greens, previousValue.greens),
      }
    })

    // const foo = {
    //   gameNumber: gameNumber,
    //   ...maxFromPulls,
    // };
    // console.log(foo);
    return {
      gameNumber: gameNumber,
      ...maxFromPulls,
    }
  });

  const filteredGames = maxPullsFromGames.filter(game => {
    return game.reds <= bagMaxReds && game.blues <= bagMaxBlues && game.greens <= bagMaxGreens;
  });

  // 3245 too high
  return filteredGames.map(game => Number.parseInt(game.gameNumber)).reduce((accum, game) => game + accum, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const maxPullsFromGames = input.map(line => {
    const initial = line.match(/Game (\d+): (.*)/)!!;
    const gameNumber = initial[1];
    // console.log(`********************** GAME ${gameNumber}`);

    const pulls = initial[2].split(";");
    const maxFromPulls = pulls.map(pull => {
      const reds = Number.parseInt(pull.match(/(\d+) red/)?.[1] || "0");
      const blues = Number.parseInt(pull.match(/(\d+) blue/)?.[1] || "0");
      const greens = Number.parseInt(pull.match(/(\d+) green/)?.[1] || "0");

      return {
        reds,
        blues,
        greens,
      }
    }).reduce((previousValue, currentValue) => {
      return {
        reds: Math.max(currentValue.reds, previousValue.reds),
        blues: Math.max(currentValue.blues, previousValue.blues),
        greens: Math.max(currentValue.greens, previousValue.greens),
      }
    })

    return {
      gameNumber: gameNumber,
      ...maxFromPulls,
    }
  });

  // console.log(maxPullsFromGames);
  return maxPullsFromGames.reduce((power, game) => {
    return power + (game.reds * game.blues * game.greens);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green`,
        expected: 1,
      },
      {
        input: `Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue`,
        expected: 2,
      },
      {
        input: `Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red`,
        expected: 0,
      },
      {
        input: `Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red`,
        expected: 0,
      },
      {
        input: `Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 5,
      },
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
      {
        input: `Game 1: 4 green, 3 blue, 11 red; 7 red, 5 green, 10 blue; 3 green, 8 blue, 8 red; 4 red, 12 blue; 15 red, 3 green, 10 blue
Game 2: 3 red, 1 blue, 2 green; 1 blue, 9 green; 1 red, 10 green
Game 3: 5 green, 9 red, 4 blue; 3 green, 7 blue; 12 blue, 3 green, 3 red; 3 blue, 7 red, 2 green; 7 blue, 3 green, 10 red
Game 4: 2 green, 2 blue; 12 red, 9 green, 2 blue; 13 green, 15 red, 4 blue; 14 red, 3 green, 5 blue; 6 red, 1 green; 1 blue, 2 red, 2 green
Game 5: 2 green, 6 blue; 1 red, 3 green, 5 blue; 3 green, 4 blue; 3 blue, 5 green, 1 red; 5 blue
Game 6: 5 green, 1 blue, 3 red; 8 green, 15 red; 16 green, 5 red, 1 blue
Game 7: 1 blue, 3 red, 11 green; 18 red, 16 blue, 5 green; 13 blue, 5 green; 1 red, 8 green, 15 blue
Game 8: 1 green, 14 blue, 1 red; 10 blue; 1 green
Game 9: 4 green, 12 blue, 1 red; 14 blue; 2 blue, 4 green; 4 green, 1 red, 10 blue`,
        expected: 27,
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green`,
        expected: 48,
      },
      {
        input: `Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue`,
        expected: 12,
      },
      {
        input: `Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red`,
        expected: 1560,
      },
      {
        input: `Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red`,
        expected: 630,
      },
      {
        input: `Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 36,
      },
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
