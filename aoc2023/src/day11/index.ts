import run from "aocrunner";
import "../utils/index.js";

type Galaxy = {
  id: number;
  x: number;
  y: number;
}

const manhattanDistance = (a: Galaxy, b: Galaxy) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const parseInput = (rawInput: string) => {
  return rawInput.split("\n");
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const galaxies: Galaxy[] = [];
  let nextGalaxyId = 1;
  const galaxiesByColumn: Galaxy[][] = Array.from({ length: lines[0].length }, () => [] as Galaxy[]);
  let y = 0;
  lines.forEach((line) => {
    let foundGalaxyInLine = false;
    line.split("").forEach((char, x) => {
      if (char === "#") {
        const galaxy = { id: nextGalaxyId++, x, y };
        galaxies.push(galaxy);
        galaxiesByColumn[x].push(galaxy);
        foundGalaxyInLine = true;
      }
    });
    y++;
    if (!foundGalaxyInLine) {
      y++;
    }
  });

  // We already expanded the rows as we went, now we have to do columns
  let increment = 0;
  for (let i = 0; i < galaxiesByColumn.length; i++) {
    if (galaxiesByColumn[i].length === 0) {
      increment++;
    } else {
      galaxiesByColumn[i].forEach(galaxy => {
        galaxy.x = galaxy.x + increment;
      })
    }
  }

  let distanceSum = 0;
  while (galaxies.length > 0) {
    const galaxy = galaxies.pop()!!;
    distanceSum += galaxies.reduce((sum, otherGalaxy) => {
      return sum + manhattanDistance(galaxy, otherGalaxy);
    }, 0);
  }

  return distanceSum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const galaxies: Galaxy[] = [];
  let nextGalaxyId = 1;
  const galaxiesByColumn: Galaxy[][] = Array.from({ length: lines[0].length }, () => [] as Galaxy[]);
  let y = 0;
  lines.forEach((line) => {
    let foundGalaxyInLine = false;
    line.split("").forEach((char, x) => {
      if (char === "#") {
        const galaxy = { id: nextGalaxyId++, x, y };
        galaxies.push(galaxy);
        galaxiesByColumn[x].push(galaxy);
        foundGalaxyInLine = true;
      }
    });
    if (!foundGalaxyInLine) {
      y += 1000000;
    } else {
      y++;
    }
  });

  // We already expanded the rows as we went, now we have to do columns
  let increment = 0;
  for (let i = 0; i < galaxiesByColumn.length; i++) {
    if (galaxiesByColumn[i].length === 0) {
      increment += 999999;
    } else {
      galaxiesByColumn[i].forEach(galaxy => {
        galaxy.x = galaxy.x + increment;
      })
    }
  }

  let distanceSum = 0;
  while (galaxies.length > 0) {
    const galaxy = galaxies.pop()!!;
    distanceSum += galaxies.reduce((sum, otherGalaxy) => {
      return sum + manhattanDistance(galaxy, otherGalaxy);
    }, 0);
  }

  return distanceSum;
};

run({
  part1: {
    tests: [
      {
        input: `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `
// ...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....`,
//         expected: 8410,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
