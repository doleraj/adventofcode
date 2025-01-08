import run from "aocrunner";

type Move = { op: string, value: number };

const parseInput = (rawInput: string) => rawInput
  .split("\n").map(l => ({ op: l.slice(0, 1), value: Number.parseInt(l.slice(1)) } as Move));

const part1 = (rawInput: string) => {
  const moves = parseInput(rawInput);
  let facing: "N"|"E"|"S"|"W" = "E";
  let position = { x: 0, y: 0 };

  for (let move of moves) {
    if (move.op === "R") {
      switch (facing) {
        case "N": {
          switch (move.value) {
            case 90: facing = "E"; break; case 180: facing = "S"; break; case 270: facing = "W"; break;
          } break;
        }
        case "E": {
          switch (move.value) {
            case 90: facing = "S"; break; case 180: facing = "W"; break; case 270: facing = "N"; break;
          } break;
        }
        case "S": {
          switch (move.value) {
            case 90: facing = "W"; break; case 180: facing = "N"; break; case 270: facing = "E"; break;
          } break;
        }
        case "W": {
          switch (move.value) {
            case 90: facing = "N"; break; case 180: facing = "E"; break; case 270: facing = "S"; break;
          } break;
        }
      }
    } else if (move.op === "L") {
      switch (facing) {
        case "N": {
          switch (move.value) {
            case 90: facing = "W"; break; case 180: facing = "S"; break; case 270: facing = "E"; break;
          } break;
        }
        case "E": {
          switch (move.value) {
            case 90: facing = "N"; break; case 180: facing = "W"; break; case 270: facing = "S"; break;
          } break;
        }
        case "S": {
          switch (move.value) {
            case 90: facing = "E"; break; case 180: facing = "N"; break; case 270: facing = "W"; break;
          } break;
        }
        case "W": {
          switch (move.value) {
            case 90: facing = "S"; break; case 180: facing = "E"; break; case 270: facing = "N"; break;
          } break;
        }
      }
    } else if (move.op === "N" || (move.op === "F" && facing === "N")) {
      position.y += move.value;
    } else if (move.op === "E" || (move.op === "F" && facing === "E")) {
      position.x += move.value;
    } else if (move.op === "S" || (move.op === "F" && facing === "S")) {
      position.y -= move.value;
    } else if (move.op === "W" || (move.op === "F" && facing === "W")) {
      position.x -= move.value;
    }
  }

  return Math.abs(position.x) + Math.abs(position.y);
};

const part2 = (rawInput: string) => {
  const moves = parseInput(rawInput);
  let waypoint = { x: 10, y: 1 };
  let position = { x: 0, y: 0 };

  for (let move of moves) {
    if (move.op === "L" || move.op === "R") {
      const theta = move.op === "L" ? move.value * (Math.PI / 180) : -move.value * (Math.PI / 180);
      const newX = Math.round(waypoint.x * Math.cos(theta) - waypoint.y * Math.sin(theta));
      const newY = Math.round(waypoint.y * Math.cos(theta) + waypoint.x * Math.sin(theta));
      waypoint.x = newX;
      waypoint.y = newY;
    } else if (move.op === "N") {
      waypoint.y += move.value;
    } else if (move.op === "E") {
      waypoint.x += move.value;
    } else if (move.op === "S") {
      waypoint.y -= move.value;
    } else if (move.op === "W") {
      waypoint.x -= move.value;
    } else if (move.op === "F") {
      for (let i = 0; i < move.value; i++) {
        position.y += waypoint.y;
        position.x += waypoint.x;
      }
    }
  }

  return Math.abs(position.x) + Math.abs(position.y);
};

run({
  part1: {
    tests: [
      {
        input: `
F10
N3
F7
R90
F11`,
        expected: 25,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
F10
N3
F7
R90
F11`,
        expected: 286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
