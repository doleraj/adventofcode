import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const inputLines = rawInput.split("\n");

  const parsedInput = inputLines.map((line) => {
    const basic = line.split(":");
    const id = basic[0].slice(4, basic[0].length).trim();
    const games = basic[1].split(";").map((game) => {
      const colors = game.trim().split(", ");
      const colorCounts = colors.map((color) => {
        const [count, colorName] = color.split(" ");
        return { id: parseInt(id), count: parseInt(count), color: colorName };
      });
      return colorCounts;
    });
    return games;
  });

  return parsedInput;
}

const part1 = (rawInput: string) => {
  const games = parseInput(rawInput);
  const possibleGames: number[] = [];

  games.forEach((game: { id: number, count: number; color: string }[][]) => {
    const maxRed = Math.max(...game.map((colors) => colors.filter((color) => color.color === "red")[0]?.count || 0));
    const maxGreen = Math.max(...game.map((colors) => colors.filter((color) => color.color === "green")[0]?.count || 0));
    const maxBlue = Math.max(...game.map((colors) => colors.filter((color) => color.color === "blue")[0]?.count || 0));

    if (maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14) {
      possibleGames.push(game[0][0].id);
    }
  });

  return possibleGames.reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const games = parseInput(rawInput);
  
  const gameScores: number[] = [];

  games.forEach((game: { id: number, count: number; color: string }[][]) => {
    const redCubes = game.map((colors) => colors.filter((color) => color.color === "red")[0]?.count || 0);
    const greenCubes = game.map((colors) => colors.filter((color) => color.color === "green")[0]?.count || 0);
    const blueCubes = game.map((colors) => colors.filter((color) => color.color === "blue")[0]?.count || 0);

    const maxRed = Math.max(...redCubes);
    const maxGreen = Math.max(...greenCubes);
    const maxBlue = Math.max(...blueCubes);

    const gameScore = maxRed * maxGreen * maxBlue;
    gameScores.push(gameScore);
  });

  const sum = gameScores.reduce((acc, curr) => acc + curr, 0);
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
      {
        input: `Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 5,
      },
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
