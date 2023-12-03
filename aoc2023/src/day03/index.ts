import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

interface FoundNumber {
  foundNumber: number;
  y: number;
  xMin: number;
  xMax: number;
}

interface FoundSymbol {
  foundSymbol: string;
  y: number;
  x: number;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const numbers: FoundNumber[] = [];
  const symbols: FoundSymbol[] = [];

  let lineLength: number;
  input.forEach((line, yIndex) => {
    lineLength = line.length;
    const numberMatches = line.matchAll(/(\d+)/g);
    Array.from(numberMatches).map(match => {
      numbers.push({
        foundNumber: Number.parseInt(match[0]),
        y: yIndex,
        xMin: (match.index || 0),
        xMax: (match.index || 0) + match[0].length - 1,
      });
    });

    const symbolMatches = line.matchAll(/([@#$%\-&=+\/*])/g);
    Array.from(symbolMatches).map(match => {
      symbols.push({
        foundSymbol: match[0],
        y: yIndex,
        x: (match.index || 0),
      });
    });
  });

  // console.log(numbers);
  // console.log(symbols);

  const partNumbers = numbers.filter(foundNumber => {
    const minYOfRange = Math.max(0, foundNumber.y - 1);
    const maxYOfRange = Math.min(input.length, foundNumber.y + 1);
    const minXOfRange = Math.max(0, foundNumber.xMin - 1);
    const maxXOfRange = Math.min(lineLength, foundNumber.xMax + 1);
    const adjacentSymbols = symbols.filter(symbol => {
      const insideYRange = minYOfRange <= symbol.y && symbol.y <= maxYOfRange;
      const insideXRange = minXOfRange <= symbol.x && symbol.x <= maxXOfRange;

      return insideXRange && insideYRange;
    });

    return adjacentSymbols.length > 0;
  });
  // console.log(partNumbers);

  // 528595 too high
  return partNumbers.map(partNumber => partNumber.foundNumber).reduce((accum, partNumber) => accum + partNumber);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const numbers: FoundNumber[] = [];
  const symbols: FoundSymbol[] = [];

  let lineLength: number;
  input.forEach((line, yIndex) => {
    lineLength = line.length;
    const numberMatches = line.matchAll(/(\d+)/g);
    Array.from(numberMatches).map(match => {
      numbers.push({
        foundNumber: Number.parseInt(match[0]),
        y: yIndex,
        xMin: (match.index || 0),
        xMax: (match.index || 0) + match[0].length - 1,
      });
    });

    const symbolMatches = line.matchAll(/([@#$%\-&=+\/*])/g);
    Array.from(symbolMatches).map(match => {
      symbols.push({
        foundSymbol: match[0],
        y: yIndex,
        x: (match.index || 0),
      });
    });
  });

  // console.log(numbers);
  // console.log(symbols);

  const gearValues = symbols.map(symbol => {
    if (symbol.foundSymbol !== "*") {
      return -1;
    }

    const adjacentNumbers = numbers.filter(foundNumber => {
      const minYOfRange = Math.max(0, foundNumber.y - 1);
      const maxYOfRange = Math.min(input.length, foundNumber.y + 1);
      const minXOfRange = Math.max(0, foundNumber.xMin - 1);
      const maxXOfRange = Math.min(lineLength, foundNumber.xMax + 1);

      const insideYRange = minYOfRange <= symbol.y && symbol.y <= maxYOfRange;
      const insideXRange = minXOfRange <= symbol.x && symbol.x <= maxXOfRange;
      return insideXRange && insideYRange;
    });

    if (adjacentNumbers.length === 2) {
      return adjacentNumbers[0].foundNumber * adjacentNumbers[1].foundNumber;
    } else {
      return -1;
    }
  });
  // console.log(gearValues.filter(gear => gear > 0));

  return gearValues.filter(gear => gear > 0).reduce((accum, gearValue) => accum + gearValue);
};

run({
  part1: {
    tests: [
      {
        input: `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
      {
        input: `
...733.......289..262.....520..................161.462..........450.........................183.............................................
....*....................*.............707.352....*............/.....................801...@...............333..196........484.635......287.
....42.........131....913..............*......&..........634..................440..&...............83.....@...........404$..=....*..423.*...
618.......272....*.........&......547.344...............#............689.589.*....150......382=................................168......433.
..........=...............253.102*.........#......78.......804..........*........................858.........................-..............`,
        expected: 11800
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
