import run from "aocrunner";

type Plot = { y: number; x: number; crop: string; group: number };

const parseInput = (rawInput: string) => {
  const plotLookup: Record<string, Plot[]> = {};

  const grid = rawInput.split("\n")
    .map((line, y) => line.split("")
      .map((char, x) => {
        const plot = { y, x, crop: char, group: -1 };

        if (!plotLookup[char]) {
          plotLookup[char] = [];
        }
        plotLookup[char].push(plot);

        return plot;
      }));

  return { grid, plotLookup };
}

const groupPlot = (plot: Plot, grid: Plot[][], groupId: number) =>  {
  if (plot.group !== -1) {
    return;
  }
  plot.group = groupId;
  [[-1, 0], [1, 0], [0, -1], [0, 1]].map(mods => {
    if (plot.y + mods[0] < 0 || plot.y + mods[0] > grid.length - 1) return null;
    if (plot.x + mods[1] < 0 || plot.x + mods[1] > grid[0].length - 1) return null;

    return grid[plot.y + mods[0]][plot.x + mods[1]];
  }).filter((v): v is Plot => v !== null).forEach(neighbor => {

    if (plot.crop == neighbor.crop && neighbor.group === -1) {
      groupPlot(neighbor, grid, groupId);
    }
  });
}

const groupBy = <T>(array: T[], predicate: (value: T) => string) => {
  return array.reduce((acc, value, index, array) => {
    (acc[predicate(value)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });
}

function groupPlots(plotLookup: Record<string, Plot[]>, grid: Plot[][]) {
  Object.values(plotLookup).map((plotSquares) => {
    let groupId = 0;
    plotSquares.forEach((plot) => {
      if (plot.group === -1) {
        groupPlot(plot, grid, groupId++);
      }
    });
  });
}

const part1 = (rawInput: string) => {
  const { grid, plotLookup } = parseInput(rawInput);
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;
  groupPlots(plotLookup, grid);

  return Object.entries(plotLookup).reduce(
    (totalPrice, [crop, plotSquares]) => {
      const groupedPlots = groupBy(plotSquares, (plot) =>
        plot.group.toString(),
      );
      return (
        totalPrice +
        Object.keys(groupedPlots).reduce((groupPrice, group) => {
          const groupPlots = groupedPlots[group];
          const area = groupPlots.length;

          const perimeter = groupPlots.reduce((perimeter, square) => {
            let squarePerimeter = 0;

            if (square.y === 0 || grid[square.y - 1][square.x].crop !== square.crop) squarePerimeter++; // Up
            if (square.x === maxX || grid[square.y][square.x + 1].crop !== square.crop) squarePerimeter++; // Right
            if (square.y === maxY || grid[square.y + 1][square.x].crop !== square.crop) squarePerimeter++; // Down
            if (square.x === 0 || grid[square.y][square.x - 1].crop !== square.crop) squarePerimeter++; // Left

            return perimeter + squarePerimeter;
          }, 0);

          // console.log(`Group ${group} of crop ${crop} has area ${area} and perimeter ${perimeter}`);
          // console.log(`Total price now ${groupPrice + (area * perimeter)}`);
          return groupPrice + area * perimeter;
        }, 0)
      );
    }, 0);
};

type Directions = "U" | "D" | "L" | "R";
type Corner = { visited: boolean, point: number[] };

const findNextInDirection = (current: Corner, direction: Directions, boundaryCorners: Corner[]) => {
  if (direction === "U") {
    return boundaryCorners.find(other =>
      other.point[0] === current.point[0] - 1 && other.point[1] === current.point[1]);
  } else if (direction === "R") {
    return boundaryCorners.find(other =>
      other.point[0] === current.point[0] && other.point[1] === current.point[1] + 1);
  } else if (direction === "D") {
    return boundaryCorners.find(other =>
      other.point[0] === current.point[0] + 1 && other.point[1] === current.point[1]);
  } else {
    return boundaryCorners.find(other =>
      other.point[0] === current.point[0] && other.point[1] === current.point[1] - 1);
  }
}

const rotateDirection = (direction: Directions) => {
  if (direction === "U") { return "R"; }
  if (direction === "R") { return "D"; }
  if (direction === "D") { return "L"; }
  return "U";
}

const part2 = (rawInput: string) => {
  const { grid, plotLookup } = parseInput(rawInput);
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;
  groupPlots(plotLookup, grid);

  return Object.entries(plotLookup).reduce(
    (totalPrice, [crop, plotSquares]) => {
      const groupedPlots = groupBy(plotSquares, (plot) =>
        plot.group.toString(),
      );
      return (
        totalPrice +
        Object.keys(groupedPlots).reduce((groupPrice, group) => {
          const groupPlots = groupedPlots[group];
          const area = groupPlots.length;

          let corners = 0;
          groupPlots.forEach(current => {
            // console.log(`Looking at %o`, current)

            const top = groupPlots.findIndex(other =>
              other.y === current.y - 1 && other.x === current.x);
            const topRight = groupPlots.findIndex(other =>
              other.y === current.y - 1 && other.x === current.x + 1);
            const right = groupPlots.findIndex(other =>
              other.y === current.y && other.x === current.x + 1);
            const bottomRight = groupPlots.findIndex(other =>
              other.y === current.y + 1 && other.x === current.x + 1);
            const bottom = groupPlots.findIndex(other =>
              other.y === current.y + 1 && other.x === current.x);
            const bottomLeft = groupPlots.findIndex(other =>
              other.y === current.y + 1 && other.x === current.x - 1);
            const left = groupPlots.findIndex(other =>
              other.y === current.y && other.x === current.x - 1);
            const topLeft = groupPlots.findIndex(other =>
              other.y === current.y - 1 && other.x === current.x - 1);

            if (top === -1 && right === -1) {
              // console.log(`Found corner TR - %o`, current);
              corners++
            }
            if (bottom === -1 && right === -1) {
              // console.log(`Found corner LR - %o`, current);
              corners++
            }
            if (bottom === -1 && left === -1) {
              // console.log(`Found corner LL - %o`, current);
              corners++
            }
            if (top === -1 && left === -1) {
              // console.log(`Found corner TL - %o`, current);
              corners++
            }
            if (top > -1 && right > -1 && topRight === -1) {
              // console.log(`Found inner corner TR - %o`, current);
              corners++
            }
            if (bottom > -1 && right > -1 && bottomRight === -1) {
              // console.log(`Found inner corner LR - %o`, current);
              corners++
            }
            if (bottom > -1 && left > -1 && bottomLeft === -1) {
              // console.log(`Found inner corner LL - %o`, current);
              corners++
            }
            if (top > -1 && left > -1 && topLeft === -1) {
              // console.log(`Found inner corner TL - %o`, current);
              corners++
            }
          });

          // console.log(`Corners for crop ${crop} group ${group}: %o`, corners);
          return groupPrice + (area * corners);
        }, 0)
      );
    }, 0);
}

run({
  part1: {
    tests: [
      {
        input: `
AAAA
BBCD
BBCC
EEEC`,
        expected: 140,
      },
      {
        input: `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 772,
      },
      {
        input: `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
      {
        input: `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 436,
      },
      {
        input: `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
      {
        input: `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
        expected: 368,
      },
      {
        input: `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1206,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
