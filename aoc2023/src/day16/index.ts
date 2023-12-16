import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => {
    return line.split("");
  });
}

type Beam = { x: number, y: number, facing: "N"|"W"|"E"|"S" };

const printGrid = (grid: string[][], beamSpots: Map<string, Beam[]>) => {
  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[y].length; x++) {
      const beamsInSpot = beamSpots.get(`${x}-${y}`);

      if (grid[y][x] !== ".") {
        line += grid[y][x];
      } else if (beamsInSpot && beamsInSpot.length > 1) {
        line += beamsInSpot.length;
      } else if (beamsInSpot) {
        const beam = beamsInSpot[0];

        if (beam.facing == "N") {
          line += "^";
        } else if (beam.facing === "E") {
          line += ">";
        } else if (beam.facing === "S") {
          line += "v";
        } else if (beam.facing === "W") {
          line += "<";
        }
      } else {
        line += grid[y][x];
      }
    }
    console.log(line);
  }
};

function getEnergizedSpaces(grid: string[][], initialSpot: Beam) {
  const xMax = grid[0].length - 1;
  const yMax = grid.length - 1;

  const energizedSpaces = new Set<string>();
  const beamSpots = new Map<string, Beam[]>();
  const beams: Beam[] = [initialSpot];

  let ticks = 0;
  while (beams.length > 0 && ticks < 1000) {
    ticks++;
    for (const beam of beams) {
      // console.log(`Working on beam ${JSON.stringify(beam)}`);

      // The beam wouldn't be here if it wasn't valid, so mark the spot as energized
      const beamKey = `${beam.x}-${beam.y}`;
      energizedSpaces.add(beamKey);

      // Check for it in the list - if we have a match on x, y, and facing, we've been here before
      if (!beamSpots.has(beamKey)) {
        beamSpots.set(beamKey, [JSON.parse(JSON.stringify(beam))])
      } else {
        const beamsAtSpot = beamSpots.get(beamKey)!!;
        if (beamsAtSpot.findIndex(b => b.x === beam.x && b.y === beam.y && b.facing === beam.facing) > 0) {
          // We've been exactly here before. Remove this beam from the list.
          const beamIndex = beams.findIndex(b => b.x === beam.x && b.y === beam.y && b.facing === beam.facing);
          beams.splice(beamIndex, 1);
          continue;
        } else {
          beamSpots.get(beamKey)!!.push(JSON.parse(JSON.stringify(beam)));
        }
      }

      // If the beam is on a splitter, split, then move on
      if ((beam.facing === "E" || beam.facing === "W") && grid[beam.y][beam.x] === "|") {
        // console.log("hit the | splitter")

        if (beam.y - 1 >= 0) {
          beams.push({facing: "N", x: beam.x, y: beam.y - 1});
        }
        if (beam.y + 1 <= yMax) {
          beams.push({facing: "S", x: beam.x, y: beam.y + 1});
        }
        // Remove the original beam
        const beamIndex = beams.findIndex(b => b.x === beam.x && b.y === beam.y && b.facing === beam.facing);
        beams.splice(beamIndex, 1);
      } else if ((beam.facing === "N" || beam.facing === "S") && grid[beam.y][beam.x] === "-") {
        // console.log("hit the - splitter")
        if (beam.x - 1 >= 0) {
          beams.push({facing: "W", x: beam.x - 1, y: beam.y});
          // console.log(`Grid at new loc is: ${grid[beam.y][beam.x - 1]}`)
        }
        if (beam.x + 1 <= xMax) {
          beams.push({facing: "E", x: beam.x + 1, y: beam.y});
          // console.log(`Grid at new loc is: ${grid[beam.y][beam.x + 1]}`)
        }
        // Remove the original beam
        const beamIndex = beams.findIndex(b => b.x === beam.x && b.y === beam.y && b.facing === beam.facing);
        beams.splice(beamIndex, 1);
      } else {
        // Adjust facing if needed
        if (grid[beam.y][beam.x] === "/") {
          if (beam.facing === "E") {
            beam.facing = "N";
          } else if (beam.facing === "N") {
            beam.facing = "E";
          } else if (beam.facing === "S") {
            beam.facing = "W";
          } else if (beam.facing === "W") {
            beam.facing = "S";
          }
        } else if (grid[beam.y][beam.x] === "\\") {
          if (beam.facing === "E") {
            beam.facing = "S";
          } else if (beam.facing === "S") {
            beam.facing = "E";
          } else if (beam.facing === "N") {
            beam.facing = "W";
          } else if (beam.facing === "W") {
            beam.facing = "N";
          }
        }

        // Then move the lightcycle
        if (beam.facing == "N") {
          beam.y -= 1;
        } else if (beam.facing === "E") {
          beam.x += 1;
        } else if (beam.facing === "S") {
          beam.y += 1;
        } else if (beam.facing === "W") {
          beam.x -= 1;
        }
        // console.log(`New beam pos - y: ${beam.y} x: ${beam.x}`)

        // The lightcycle has left the grid, remove it
        if (beam.x < 0 || beam.x > xMax || beam.y < 0 || beam.y > yMax) {
          const beamIndex = beams.findIndex(b => b.x === beam.x && b.y === beam.y && b.facing === beam.facing);
          beams.splice(beamIndex, 1);
        }
      }
    }
  }
  // printGrid(grid, beamSpots);

  return energizedSpaces.size;
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  return getEnergizedSpaces(grid, {x: 0, y: 0, facing: "E"});
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const energizedCounts: number[] = [];
  for (let y = 0; y < grid.length ; y++) {
    energizedCounts.push(getEnergizedSpaces(grid, { x: 0, y, facing: "E" }));
    energizedCounts.push(getEnergizedSpaces(grid, { x: grid[0].length - 1, y, facing: "W" }));
  }

  for (let x = 0; x < grid[0].length - 1; x++) {
    energizedCounts.push(getEnergizedSpaces(grid, { x, y: 0, facing: "S" }));
    energizedCounts.push(getEnergizedSpaces(grid, { x, y: grid.length - 1, facing: "N" }));
  }

  return Math.max(...energizedCounts);
};

run({
  part1: {
    tests: [
      {
        input: `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
