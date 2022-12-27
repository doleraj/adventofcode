import run from "aocrunner";
import _ from 'lodash';

const parseInput = (rawInput: string) => {
  const elfLocations = new Set<string>();
  rawInput.split("\n")
    .flatMap((line, yIndex) => line.split("")
      .map((char, xIndex) => char === "#" ? [xIndex, yIndex] : null)
      .filter((value): value is number[] => value !== null)
    ).forEach(elfLocation => elfLocations.add(elfLocation.toString()));

  return elfLocations;
}

const findBounds = (elves: Set<string>) => {
  const xValues = [...elves].map(e => Number(e.split(',')[0]));
  const yValues = [...elves].map(e => Number(e.split(',')[1]));
  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  };
}

function createProposedLocations(elfLocations: Set<string>, directionArray: string[]): Record<string, string[]> {
  const proposedLocations: Record<string, string[]> = {};
  elfLocations.forEach(elfLocation => {
    // console.log(elf);
    const [x, y] = elfLocation.split(",").map(Number);
    const northElfExists = elfLocations.has([x, y - 1].toString());
    const northEastElfExists = elfLocations.has([x + 1, y - 1].toString());
    const northWestElfExists = elfLocations.has([x - 1, y - 1].toString());
    const southElfExists = elfLocations.has([x, y + 1].toString());
    const southEastElfExists = elfLocations.has([x + 1, y + 1].toString());
    const southWestElfExists = elfLocations.has([x - 1, y + 1].toString());
    const eastElfExists = elfLocations.has([x + 1, y].toString());
    const westElfExists = elfLocations.has([x - 1, y].toString());
    // console.log(`n: ${northElfExists} ne: ${northEastElfExists} e: ${eastElfExists} se: ${southEastElfExists} s: ${southElfExists} sw: ${southWestElfExists} w: ${westElfExists} nw: ${northWestElfExists}`);

    if (!northElfExists && !northEastElfExists && !eastElfExists && !southEastElfExists
      && !southElfExists && !southWestElfExists && !westElfExists && !northWestElfExists) {
      return;
    }

    for (const direction of directionArray) {
      // console.log(direction);
      switch (direction) {
        case "N": {
          if (!northElfExists && !northEastElfExists && !northWestElfExists) {
            const proposedLocation = [x, y - 1].toString();
            if (!proposedLocations[proposedLocation]) {
              proposedLocations[proposedLocation] = [elfLocation];
            } else {
              proposedLocations[proposedLocation].push(elfLocation);
            }
            // console.log(`Elf ${elfLocation} proposing to move from ${elfLocation} to ${elf.proposedLocation}`)
            return;
          }
          break;
        }
        case "S": {
          if (!southElfExists && !southEastElfExists && !southWestElfExists) {
            const proposedLocation = [x, y + 1].toString();
            if (!proposedLocations[proposedLocation]) {
              proposedLocations[proposedLocation] = [elfLocation];
            } else {
              proposedLocations[proposedLocation].push(elfLocation);
            }
            // console.log(`Elf ${elfLocation} proposing to move from ${elfLocation} to ${elf.proposedLocation}`)
            return;
          }
          break;
        }
        case "W": {
          if (!westElfExists && !northWestElfExists && !southWestElfExists) {
            const proposedLocation = [x - 1, y].toString();
            if (!proposedLocations[proposedLocation]) {
              proposedLocations[proposedLocation] = [elfLocation];
            } else {
              proposedLocations[proposedLocation].push(elfLocation);
            }
            // console.log(`Elf ${elfLocation} proposing to move from ${elfLocation} to ${elf.proposedLocation}`)
            return;
          }
          break;
        }
        case "E": {
          if (!eastElfExists && !northEastElfExists && !southEastElfExists) {
            const proposedLocation = [x + 1, y].toString();
            if (!proposedLocations[proposedLocation]) {
              proposedLocations[proposedLocation] = [elfLocation];
            } else {
              proposedLocations[proposedLocation].push(elfLocation);
            }
            // console.log(`Elf ${elfLocation} proposing to move from ${elfLocation} to ${elf.proposedLocation}`)
            return;
          }
          break;
        }
      }
    }
  });

  return proposedLocations;
}

const part1 = (rawInput: string) => {
  const elfLocations = parseInput(rawInput);
  let round = 1;
  let directionArray = ["N", "S", "W", "E"];

  while (round <= 10) {
    // console.log(elfLocations);
    const proposedLocations = createProposedLocations(elfLocations, directionArray);
    // console.log(elfLocations);
    // console.log(proposedLocations);
    for (let [proposedLocation, proposingElves] of Object.entries(proposedLocations)) {
      if (proposingElves.length === 1) {
        const oldLoc = proposingElves[0];
        elfLocations.delete(oldLoc);
        elfLocations.add(proposedLocation);
      }
    }
    // console.log(elfLocations);
    directionArray.push(directionArray.shift()!!);
    round++;
  }

  const { minX, maxX, minY, maxY } = findBounds(elfLocations);
  for (let y = minY - 1; y < maxY + 2; y++) {
    let line = "";
    for (let x = minX - 1; x < maxX + 2; x++) {
      if (elfLocations.has([x, y].toString())) {
        line += "#";
      } else {
        line += ".";
      }
    }
    // console.log(line);
  }

  // console.log(`X: ${minX}-${maxX} Y: ${minY}-${maxY} elves: ${elfLocations.size}`)
  return (Math.abs(maxX - minX + 1) * Math.abs(maxY - minY + 1)) - elfLocations.size;
};

const part2 = (rawInput: string) => {
  const elfLocations = parseInput(rawInput);
  let round = 1;
  let directionArray = ["N", "S", "W", "E"];

  let lastElfLocations = new Set<string>();
  while (round < 949) {
    // console.log(elfLocations);
    const proposedLocations = createProposedLocations(elfLocations, directionArray);
    // console.log(elfLocations);
    // console.log(proposedLocations);
    for (let [proposedLocation, proposingElves] of Object.entries(proposedLocations)) {
      if (proposingElves.length === 1) {
        const oldLoc = proposingElves[0];
        elfLocations.delete(oldLoc);
        elfLocations.add(proposedLocation);
      }
    }
    // console.log(elfLocations);
    if (Array.from(elfLocations.values()).every(val => lastElfLocations.has(val))) {
      break;
    }
    lastElfLocations = _.clone(elfLocations);
    directionArray.push(directionArray.shift()!!);
    round++;
  }

  return round;
};

run({
  part1: {
    tests: [
      {
        input: `
.....
..##.
..#..
.....
..##.
.....`,
        expected: 25,
      },
      {
        input: `
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`,
        expected: 110,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`,
        expected: 20,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
