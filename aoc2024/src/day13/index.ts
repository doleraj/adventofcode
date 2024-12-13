import run from "aocrunner";


const parseInput = (rawInput: string) => {
  const machineRegex = /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/;
  return rawInput.split("\n\n").map(machine => {
    const parts= machine.match(machineRegex)!!.map(str => Number.parseInt(str, 10));

    return { xa: parts[1], ya: parts[2], xb: parts[3], yb: parts[4], xp: parts[5], yp: parts[6] };
  });
}

const part1 = (rawInput: string) => {
  const machines = parseInput(rawInput);

  return machines.reduce((totalCost, { xa, ya, xb, yb, xp, yp }) => {
    const b = (((ya * xp) - (xa * yp)) / ((xb * ya) - (yb * xa)));
    const a = (xp - (b * xb)) / xa;

    // console.log(`a ${a}, b ${b}`);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a > 100 || b > 100) {
      return totalCost;
    }

    return totalCost + (a * 3) + b;
  }, 0);
};

const part2 = (rawInput: string) => {
  const machines = parseInput(rawInput);
  machines.forEach((machine) => {
    machine.xp = 10000000000000 + machine.xp;
    machine.yp = 10000000000000 + machine.yp;
  })

  return machines.reduce((totalCost, { xa, ya, xb, yb, xp, yp }) => {
    const b = (((ya * xp) - (xa * yp)) / ((xb * ya) - (yb * xa)));
    const a = (xp - (b * xb)) / xa;

    // console.log(`a ${a}, b ${b}`);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      return totalCost;
    }

    return totalCost + (a * 3) + b;
  }, 0);
  return;
};

run({
  part1: {
    tests: [
      {
        input: `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
