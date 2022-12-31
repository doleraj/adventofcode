import run from "aocrunner";

enum BlizzardType {
  Northbound,
  Eastbound,
  Westbound,
  Southbound,
}

interface Blizzard {
  position: number[];
  type: BlizzardType;
}

const parseInput = (rawInput: string) => {
  const blizzards: Blizzard[] = [];
  const map = rawInput
    .split("\n")
    .map((line, yIndex) => line.split("").map((char, xIndex) => {
      switch (char) {
        case "^": blizzards.push({ position: [xIndex, yIndex], type: BlizzardType.Northbound }); return ".";
        case ">": blizzards.push({ position: [xIndex, yIndex], type: BlizzardType.Eastbound }); return ".";
        case "<": blizzards.push({ position: [xIndex, yIndex], type: BlizzardType.Westbound }); return ".";
        case "v": blizzards.push({ position: [xIndex, yIndex], type: BlizzardType.Southbound }); return ".";
        default: return char;
      }
    }));

  return { blizzards, map };
}

const printMap = (blizzards: Blizzard[], map: string[][], expedition: number[]) => {
  map.forEach((row, y) => {
    let line = "";
    row.map((cell, x) => {
      const locString = [x, y].toString();
      const foundBlizzards = blizzards.filter(blizzard => blizzard.position.toString() === locString);
      if (foundBlizzards.length === 1) {
        switch (foundBlizzards[0].type) {
          case BlizzardType.Northbound: line += "^"; break;
          case BlizzardType.Eastbound: line += ">"; break;
          case BlizzardType.Westbound: line += "<"; break;
          case BlizzardType.Southbound: line += "v"; break;
        }
      } else if (foundBlizzards.length > 1) {
        line += foundBlizzards.length;
      } else if (expedition.toString() === locString) {
        line += "E";
      } else {
        line += cell;
      }
    });
    console.log(line);
  })
}

function runPositions(expeditionPositions: number[][], map: string[][], blizzardPositions: string[]) {
  const nextPositions = [];
  const nextPositionStrings = new Set<string>();
  while (expeditionPositions.length > 0) {
    const expeditionPosition = expeditionPositions.pop()!!;
    const possibleMoves = [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]
      .map(deltas => [expeditionPosition[0] + deltas[0], expeditionPosition[1] + deltas[1]])
      .filter(next => next[0] > 0 && next[0] < map[0].length - 1 && next[1] >= 0 && next[1] < map.length)
      .filter(next => map[next[1]][next[0]] !== "#")
      .filter(next => !blizzardPositions.includes(next.toString()))
      .filter(next => !nextPositionStrings.has(next.toString()))
    ;

    nextPositions.push(...possibleMoves);
    for (const nextPosition of nextPositions) {
      nextPositionStrings.add(nextPosition.toString());
    }
  }
  return nextPositions;
}

const part1 = (rawInput: string) => {
  const { blizzards, map } = parseInput(rawInput);
  // console.log(blizzards);
  let expeditionPositions = [[1, 0]];
  const expeditionGoal = [map[0].length - 2, map.length - 1];
  // console.log(map[expeditionGoal[1]][expeditionGoal[0]]);
  let cycle = 0;
  while (!expeditionPositions.map(pos => pos.toString()).includes(expeditionGoal.toString()) && cycle < 2000) {
    runBlizzards(blizzards, map);
    const blizzardPositions = blizzards.map(b => b.position.toString());

    expeditionPositions = runPositions(expeditionPositions, map, blizzardPositions);
    // console.log(`Minute ${cycle + 1}`);
    // console.log(expeditionPositions);
    cycle++;
  }
  // printMap(blizzards, map, expeditionPosition);

  return cycle;
};

function runBlizzards(blizzards: Blizzard[], map: string[][]) {
  for (const blizzard of blizzards) {
    switch (blizzard.type) {
      case BlizzardType.Northbound:
        blizzard.position[1] = blizzard.position[1] - 1 > 0 ? blizzard.position[1] - 1 : map.length - 2;
        break;
      case BlizzardType.Eastbound:
        blizzard.position[0] = blizzard.position[0] + 1 < map[0].length - 1 ? blizzard.position[0] + 1 : 1;
        break;
      case BlizzardType.Westbound:
        blizzard.position[0] = blizzard.position[0] - 1 > 0 ? blizzard.position[0] - 1 : map[0].length - 2;
        break;
      case BlizzardType.Southbound:
        blizzard.position[1] = blizzard.position[1] + 1 < map.length - 1 ? blizzard.position[1] + 1 : 1;
        break;
    }
  }
}

function findGoal(expeditionPositions: number[][], expeditionGoal: number[], blizzards: Blizzard[], map: string[][], initialCycle: number): number {
  let cycle = initialCycle;
  while (!expeditionPositions.map(pos => pos.toString()).includes(expeditionGoal.toString())) {
    runBlizzards(blizzards, map);
    const blizzardPositions = blizzards.map(b => b.position.toString());

    expeditionPositions = runPositions(expeditionPositions, map, blizzardPositions);
    // console.log(`Minute ${cycle + 1}`);
    // console.log(expeditionPositions);
    cycle++;
  }
  return cycle;
}

const part2 = (rawInput: string) => {
  const { blizzards, map } = parseInput(rawInput);
  // console.log(blizzards);
  let expeditionPositions = [[1, 0]];
  let expeditionGoal = [map[0].length - 2, map.length - 1];
  let cycle = findGoal(expeditionPositions, expeditionGoal, blizzards, map, 0);

  expeditionGoal = [1, 0];
  expeditionPositions = [[map[0].length - 2, map.length - 1]];
  cycle = findGoal(expeditionPositions, expeditionGoal, blizzards, map, cycle);

  expeditionGoal = [map[0].length - 2, map.length - 1];
  expeditionPositions = [[1, 0]];
  cycle = findGoal(expeditionPositions, expeditionGoal, blizzards, map, cycle);

  return cycle;
};

run({
  part1: {
    tests: [
      {
        input: `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`,
        expected: 54,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
