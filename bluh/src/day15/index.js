import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const FREE = ".";
const ELF = "E";
const GOBLIN = "G";

const DEFAULT_ATTACK = 3;
const DEFAULT_HP = 200;

const part1 = (rawInput) => {
  let MAP = [];
  const input = parseInput(rawInput);
  input.split("\n").forEach(line => {
    MAP.push(line.split("")); // MAP[y][x] = contents of [x,y] spot
  })

  const results = doIt(JSON.parse(JSON.stringify(MAP)))
  // printMap(results.map)
  return results.outcome
};


const part2 = (rawInput) => {
  let MAP = [];
  const input = parseInput(rawInput);
  input.split("\n").forEach(line => {
    MAP.push(line.split("")); // MAP[y][x] = contents of [x,y] spot
  })

  let part2result = null;
  let elfAttack = 3;
  do {
    elfAttack++;
    part2result = doIt(JSON.parse(JSON.stringify(MAP)), elfAttack, true);
  } while (!part2result); // keep trying until combat hasn't been aborted

  printMap(part2result.map)
  return part2result.outcome;
};

function doIt(map, elfAttack = DEFAULT_ATTACK, abortIfElfDies = false) {
  let players = initPlayers(map, elfAttack);
  let data = {
    map: map,
    players: players,
    round: 0,
    outcome: null,
    elfAttack: elfAttack
  };

  round: while (true) {
    players = players.sort((p1, p2) =>
      p1.pos.y === p2.pos.y ? p1.pos.x - p2.pos.x : p1.pos.y - p2.pos.y
    );
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.alive) {
        // if there are no enemies left, game ends
        if (players.filter(p => p.alive && p.type !== player.type).length < 1) {
          break round;
        }

        let enemy = findEnemyToAttack(player, players);
        let next = enemy ? null : findNextMovement(player, players, map);
        if (!enemy && next) {
          map[player.pos.y][player.pos.x] = FREE;
          player.pos.x = next.x;
          player.pos.y = next.y;
          map[player.pos.y][player.pos.x] = player.type;

          // once we moved, check again if an enemy is at range
          enemy = findEnemyToAttack(player, players);
        }
        if (enemy) {
          // attack
          enemy.hp -= player.attack;
          if (enemy.hp < 1) {
            // we killed him! mark him as dead
            enemy.alive = false;
            map[enemy.pos.y][enemy.pos.x] = FREE;
            if (enemy.type === ELF && abortIfElfDies) return null;
          }
        }
      }
    }

    data.round++;
    // printStatus(data);
  }

  // // outcome = completed rounds * remaining hit points
  // const foo = players
  //   .filter(p => p.alive)
  //   .filter(p => p.type === ELF).map(p => `(${p.hp}, ${p.type})`)
  //   // .map(p => p.hp)
  //   // .reduce((acc, curr) => acc + curr, 0);
  // console.log(`${data.round} * ${foo}`)
  data.outcome =
    data.round *
    players
      .filter(p => p.alive)
      .map(p => p.hp)
      .reduce((acc, curr) => acc + curr, 0);

  return data;
}

function initPlayers(map, elfAttack) {
  let players = [];
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === ELF || cell === GOBLIN) {
        players.push({
          type: cell,
          hp: DEFAULT_HP,
          attack: cell === ELF ? elfAttack : 3,
          alive: true,
          pos: { x, y }
        });
      }
    });
  });
  return players;
}

function findEnemyToAttack(player, allPlayers) {
  return (
    allPlayers
      // discard allies and dead players (that will already discard himself)
      .filter(p => p.type !== player.type && p.alive)
      // get only those within range
      .filter(
        p =>
          (Math.abs(p.pos.x - player.pos.x) === 1 &&
            p.pos.y === player.pos.y) ||
          (Math.abs(p.pos.y - player.pos.y) === 1 && p.pos.x === player.pos.x)
      )
      // find the weakest one (in tie, the first found in order prevails)
      .reduce(
        (weakest, curr) =>
          weakest === null || weakest.hp > curr.hp ? curr : weakest,
        null
      )
  );
}

function findNextMovement(player, allPlayers, map) {
  let targetKeys = {}; // "x,y" ==> { x, y } of alive enemy
  allPlayers
    .filter(p => p.alive && p.type !== player.type)
    .map(p => getAdjacents(p.pos).filter(pos => map[pos.y][pos.x] === FREE))
    .reduce((acc, list) => acc.concat(...list), [])
    .forEach(pos => (targetKeys[`${pos.x},${pos.y}`] = pos));

  let visited = {};
  visited[`${player.pos.x},${player.pos.y}`] = true;

  let paths = [[player.pos]];
  while (true) {
    let newPaths = [];
    let targetPaths = [];
    paths.forEach(path => {
      let adjacents = getAdjacents(path[path.length - 1]);
      adjacents.forEach(adj => {
        let xy = `${adj.x},${adj.y}`;
        if (targetKeys[xy]) {
          // found a path to a target!
          // add it so at the end of the iteration we chose the right one based on enemy order
          targetPaths.push([...path, adj, targetKeys[xy]]);
        } else if (!visited[xy] && map[adj.y][adj.x] === FREE) {
          // new extended path to explore at next iteration
          newPaths.push([...path, adj]);
        }
        visited[xy] = true; // mark as visited so other paths ignore it
      });
    });

    if (targetPaths.length > 0) {
      // we got one or more paths reaching a target for the first time, here is where our search ends
      // if we found multiple shortest paths, use the one that reaches the first target according top-to-bottom/left-to-right order
      targetPaths = targetPaths.sort((p1, p2) =>
        p1[p1.length - 1].y === p2[p2.length - 1].y
          ? p1[p1.length - 1].x - p2[p2.length - 1].x
          : p1[p1.length - 1].y - p2[p2.length - 1].y
      );

      // return the first step to take for the shortest path ([0] is the player current position)
      return targetPaths[0][1];
    }

    // no paths to a target found yet, keep iterating with the paths after one more step
    paths = newPaths;
    if (paths.length < 1) return null; // no reachables targets, search ends without a result
  }
}

function getAdjacents(pos) {
  return [
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x - 1, y: pos.y },
    { x: pos.x + 1, y: pos.y },
    { x: pos.x, y: pos.y + 1 }
  ];
}

function printStatus(data) {
  console.log("After round", data.round);
  printMap(data.map);
  printPlayers(data.players, true);
  console.log();
}

function printMap(map) {
  console.log(map.map(row => row.join("")).join("\n"));
}

function printPlayers(players, onlyAlive) {
  players
    .filter(p => !onlyAlive || p.alive)
    .forEach(p => console.log(p.type, p.pos.x, p.pos.y, p.hp));
}



run({
  part1: {
    tests: [
      {
        input: `
#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######
        `,
        expected: 36334,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######
`,
        expected: 4988,
      },
      {
        input: `
#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######
`,
        expected: 31284,
      },
      {
        input: `
#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
`,
        expected: 6474,
      },
      {
        input: `
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
`,
        expected: 1140,
      },
      {
        input: `
#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######
`,
        expected: 3478,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
