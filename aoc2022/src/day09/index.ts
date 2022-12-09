import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const head = [0, 0];
  let tail = [0, 0];
  const tailPositions = [tail.toString()];

  input.split(("\n")).forEach(move => {
    const moveParts = move.split(" ");
    const steps = Number(moveParts[1]);
    for (let i = 0; i < steps; i++) {
      const oldHead = [...head];
      switch (moveParts[0]) {
        case "U": head[1]++; break;
        case "D": head[1]--; break;
        case "L": head[0]--; break;
        case "R": head[0]++; break;
      }

      const xDelta = head[0] - tail[0];
      const yDelta = head[1] - tail[1];

      if (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1) {
        tail = oldHead;
        if (!tailPositions.includes(tail.toString())) {
          tailPositions.push(tail.toString());
        }
      }

      // console.log(`Head: ${head} - Tail ${tail}`);
    }
  });
  // console.log(tailPositions)
  return tailPositions.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let head = [0, 0];
  let tails = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  const tailPositions = [tails[8].toString()];

  input.split(("\n")).forEach(move => {
    const moveParts = move.split(" ");
    const steps = Number(moveParts[1]);
    for (let i = 0; i < steps; i++) {
      switch (moveParts[0]) {
        case "U": head[1]++; break;
        case "D": head[1]--; break;
        case "L": head[0]--; break;
        case "R": head[0]++; break;
      }

      let leader = [...head];
      for (let tailIndex = 0; tailIndex < tails.length; tailIndex++) {
        const tail = tails[tailIndex];
        const xDelta = leader[0] - tail[0];
        const yDelta = leader[1] - tail[1];
        // console.log(`LL - ${leader} - ${tail} - ${xDelta} - ${yDelta}`);
        if (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1) {
          if (Math.abs(xDelta) >= 1 && Math.abs(yDelta) >= 1) {
            // diagonal
            if (xDelta === 2 && yDelta === 1 || xDelta === 1 && yDelta === 2 || xDelta === 2 && yDelta === 2) {
              tail[0] = tail[0] + 1;
              tail[1] = tail[1] + 1;
            } else if (xDelta === -2 && yDelta === 1 || xDelta === -1 && yDelta === 2 || xDelta === -2 && yDelta === 2) {
              tail[0] = tail[0] - 1;
              tail[1] = tail[1] + 1;
            } else if (xDelta === 2 && yDelta === -1 || xDelta === 1 && yDelta === -2 || xDelta === 2 && yDelta === -2) {
              tail[0] = tail[0] + 1;
              tail[1] = tail[1] - 1;
            } else if (xDelta === -2 && yDelta === -1 || xDelta === -1 && yDelta === -2 || xDelta === -2 && yDelta === -2) {
              tail[0] = tail[0] - 1;
              tail[1] = tail[1] - 1;
            }
          } else {
            tail[0] = tail[0] + Math.sign(xDelta);
            tail[1] = tail[1] + Math.sign(yDelta);
          }
        }

        // console.log(`LL - ${leader} -  ${tail} - ${xDelta} - ${yDelta}`);
        // console.log(`Head: ${head} - Tail ${tail}`);
        leader = [...tail];
      }
      // console.log(`Head: ${head} - Tails ${tails}`);

      if (!tailPositions.includes(tails[8].toString())) {
        tailPositions.push(tails[8].toString());
      }
    }
    // console.log(`Head: ${head} - Tails${tails.map(tail => ` [${tail}]`)}`);
  });
  // console.log(`End Tail Positions: ${tailPositions.map(tail => ` [${tail}]`)}`);
  return tailPositions.length;
  // return `Head: ${head} - Tail ${tail}`;
};

run({
  part1: {
    tests: [
     {
        input: `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`,
        expected: 1,
      },
      {
        input: `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
