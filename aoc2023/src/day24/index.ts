import run from "aocrunner";
import "../utils/index.js";
import {bignumber, number, add as mathadd, subtract as mathsubtract, divide as mathdivide, multiply as mathmultiply, sign as mathsign, BigNumber} from 'mathjs'
import {init} from 'z3-solver';

const parseInput = (rawInput: string) => {
  let id = 0;
  return rawInput.split("\n").map(line => {
    const halves = line.split(" @ ");
    const position = halves[0].split(", ").map(str => bignumber(parseInt(str)));
    const velocity = halves[1].split(", ").map(str => bignumber(parseInt(str)));
    return { id: id++, position, velocity };
  });
}

const add = (a: BigNumber, b: BigNumber): BigNumber => {
  return mathadd(a, b);
}

const subtract = (a: BigNumber, b: BigNumber): BigNumber => {
  return mathsubtract(a, b);
}

const multiply = (a: BigNumber, b: BigNumber): BigNumber => {
  return mathmultiply(a, b) as unknown as BigNumber;
}

const divide = (a: BigNumber, b: BigNumber): BigNumber => {
  return mathdivide(a, b) as unknown as BigNumber;
}

const sign = (a: BigNumber): number => {
  return number(mathsign(a));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let testAreaMinX = 200000000000000;
  let testAreaMaxX = 400000000000000;
  let testAreaMinY = 200000000000000;
  let testAreaMaxY = 400000000000000;
  if (input.length === 5) {
    testAreaMinX = 7;
    testAreaMaxX = 27;
    testAreaMinY = 7;
    testAreaMaxY = 27;
  }

  const hailstoneLinePointPairs = input.map(hailstone => {
    const secondPoint = [add(hailstone.position[0], hailstone.velocity[0]), add(hailstone.position[1], hailstone.velocity[1]), add(hailstone.position[2], hailstone.velocity[2])];
    return { id: hailstone.id, velocity: hailstone.velocity, 0: hailstone.position, 1: secondPoint };
  });

  const processedHailstoneIds: number[] = [];
  let intersections = 0;
  for (let i = 0; i < hailstoneLinePointPairs.length; i++) {
    const firstHailstone = hailstoneLinePointPairs[i];
    processedHailstoneIds.push(firstHailstone.id);
    for (let j = 0; j < hailstoneLinePointPairs.length; j++) {
      const secondHailstone = hailstoneLinePointPairs[j];
      const [x1, y1, z1] = firstHailstone[0];
      const [x2, y2, z2] = firstHailstone[1];
      const [x3, y3, z3] = secondHailstone[0];
      const [x4, y4, z4] = secondHailstone[1];

      if (processedHailstoneIds.includes(secondHailstone.id)) {
        continue;
      }

      const pXNumerator = subtract(multiply(subtract(multiply(x1, y2), multiply(y1, x2)), subtract(x3, x4)),
                                  multiply(subtract(x1, x2), subtract(multiply(x3, y4), multiply(y3, x4))));
      const pYNumerator = subtract(multiply(subtract(multiply(x1, y2), multiply(y1, x2)), subtract(y3, y4)),
                                  multiply(subtract(y1, y2), subtract(multiply(x3, y4), multiply(y3, x4))));

      const denominator = subtract(multiply(subtract(x1, x2), subtract(y3, y4)), multiply(subtract(y1, y2), subtract(x3, x4)));

      const pX = divide(pXNumerator, denominator);
      const pY = divide(pYNumerator, denominator);

      if (number(denominator) !== 0 && testAreaMinX <= number(pX) && number(pX) <= testAreaMaxX && testAreaMinY <= number(pY) && number(pY) <= testAreaMaxY) {

        // It intersected, but was it in the past?
        const [vX1, vY1, vZ1] = firstHailstone.velocity;
        const [vX2, vY2, vZ2] = secondHailstone.velocity;
        const intersectionXInFutureForHailstone1 = (sign(subtract(pX, x1)) === sign(vX1));
        const intersectionYInFutureForHailstone1 = (sign(subtract(pY, y1)) === sign(vY1));
        const intersectionXInFutureForHailstone2 = (sign(subtract(pX, x3)) === sign(vX2));
        const intersectionYInFutureForHailstone2 = (sign(subtract(pY, y3)) === sign(vY2));

        if (intersectionXInFutureForHailstone1 && intersectionYInFutureForHailstone1 && intersectionXInFutureForHailstone2 && intersectionYInFutureForHailstone2) {
          intersections++;
          // console.log(`Hailstone A: ${firstHailstone[0]}`);
          // console.log(`Hailstone B: ${secondHailstone[0]}`);
          // console.log(`Hailstones' paths will cross inside the test area (at x=${pX}, y=${pY}).`);
          //
          // if (intersections === 10) {
          //   return;
          // }
        } else {
          // console.log(`Hailstone A: ${firstHailstone[0]}`);
          // console.log(`Hailstone B: ${secondHailstone[0]}`);
          // if ((!intersectionXInFutureForHailstone1 || !intersectionYInFutureForHailstone1) && (!intersectionXInFutureForHailstone2 || intersectionYInFutureForHailstone2)) {
          //   console.log(`Hailstones' paths crossed in the past for both hailstones.`);
          // } else if (!intersectionXInFutureForHailstone1 || !intersectionYInFutureForHailstone1) {
          //   console.log(`Hailstones' paths crossed in the past for hailstone A.`);
          // } else {
          //   console.log(`Hailstones' paths crossed in the past for hailstone B.`);
          // }
        }
      }
    }
  }

  // 31874 too low.
  return intersections;
};

const part2 = async (rawInput: string) => {
  const input = parseInput(rawInput);
  const {Context} = await init();
  const {Solver, Real, Eq} = new (Context as any)('main');

  const solver = new Solver();
  let equationNumber = 0;
  const x_s0 = Real.const('x_s0');
  const y_s0 = Real.const('y_s0');
  const z_s0 = Real.const('z_s0');
  const v_sx = Real.const('v_sx');
  const v_sy = Real.const('v_sy');
  const v_sz = Real.const('v_sz');
  input.forEach(hailstone => {
    const [x_ni, y_ni, z_ni] = hailstone.position.map(n => number(n));
    const [v_nx, v_ny, v_nz] = hailstone.velocity.map(v => number(v));
    const t_n = Real.const(`t_${equationNumber++}`);

    solver.add(t_n.ge(0));
    solver.add(Eq(x_s0.add(t_n.mul(v_sx)), t_n.mul(v_nx).add(x_ni)));
    solver.add(Eq(y_s0.add(t_n.mul(v_sy)), t_n.mul(v_ny).add(y_ni)));
    solver.add(Eq(z_s0.add(t_n.mul(v_sz)), t_n.mul(v_nz).add(z_ni)));
  });

  console.log(`Starting solver check...`);
  const equationResult = await solver.check();

  if (equationResult !=='sat') {
    throw new Error("lol, is busted");
  }

  console.log(`Model is satisfied`);
  const model = solver.model();
  const xVal = model.get(x_s0);
  const yVal = model.get(y_s0);
  const zVal = model.get(z_s0);

  try {
    // console.log(`x ${xVal} y ${yVal} z ${zVal}`);
    return xVal.asNumber() + yVal.asNumber() + zVal.asNumber();
  } finally {
    setTimeout(() => {
      process.exit(0);
    });
  }
};

run({
  part1: {
    tests: [
      {
        input: `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `19, 13, 30 @ -2,  1, -2
// 18, 19, 22 @ -1, -1, -2
// 20, 25, 34 @ -2, -2, -4
// 12, 31, 28 @ -1, -2, -1
// 20, 19, 15 @  1, -5, -3`,
//         expected: 47,
//       },
    ],
    // @ts-ignore
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
