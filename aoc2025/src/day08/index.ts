import run from "aocrunner";
import { priorityQueue } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const numbers = rawInput.split("\n")
    .map(line => line.split(",").map(n => Number.parseInt(n, 10)));

  return { connections: numbers.length < 25 ? 10 : 1000, numbers };
}

const euclideanDistance = (num1: number[], num2: number[]) => {
  return Math.sqrt(Math.pow(num1[0] - num2[0], 2) + Math.pow(num1[1] - num2[1], 2) + Math.pow(num1[2] - num2[2], 2));
}

const toToken = (num: number[]) => {
  return `[${num[0]},${num[1]},${num[2]}]`;
};


type Distance = { leftJunction: number[]; rightJunction: number[]; distance: number };

const part1 = (rawInput: string) => {
  const { connections, numbers } = parseInput(rawInput);

  const distances = priorityQueue<number[][]>();
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      if (i === j) continue;

      const leftJunction = numbers[i];
      const rightJunction = numbers[j];

      const distance = euclideanDistance(leftJunction, rightJunction);
      distances.insert([leftJunction, rightJunction], distance);
    }
  }

  let circuits: Set<string>[] = numbers.map(n => new Set([toToken(n)]));
  let connectionsMade: string[][] = []
  while (connectionsMade.length < connections) {
    const [ leftJunction, rightJunction ] = distances.pop()!!;

    const leftCircuit = circuits.find(circ => circ.has(toToken(leftJunction)))!!;
    const rightCircuit = circuits.find(circ => circ.has(toToken(rightJunction)))!!;
    connectionsMade.push([toToken(leftJunction), toToken(rightJunction)]);
    for (const circ of rightCircuit.values()) {
      leftCircuit.add(circ);
    }

    if (leftCircuit !== rightCircuit) {
      rightCircuit.clear();
    }
  }

  const sorted = circuits.sort((a, b) => b.size - a.size);
  return sorted[0].size * sorted[1].size * sorted[2].size;
};

const part2 = (rawInput: string) => {
  const { connections, numbers } = parseInput(rawInput);

  const distances = priorityQueue<number[][]>();
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      if (i === j) continue;

      const leftJunction = numbers[i];
      const rightJunction = numbers[j];

      const distance = euclideanDistance(leftJunction, rightJunction);
      distances.insert([leftJunction, rightJunction], distance);
    }
  }

  let circuits: Set<string>[] = numbers.map(n => new Set([toToken(n)]));
  let mostRecentLeft: number[] = [];
  let mostRecentRight: number[] = [];
  while (circuits.filter(c => c.size !== 0).length > 1) {
    const [leftJunction, rightJunction] = distances.pop()!!;

    const leftCircuit = circuits.find((circ) => circ.has(toToken(leftJunction)))!!;
    const rightCircuit = circuits.find((circ) => circ.has(toToken(rightJunction)))!!;
    mostRecentLeft = leftJunction;
    mostRecentRight = rightJunction;
    for (const circ of rightCircuit.values()) {
      leftCircuit.add(circ);
    }

    if (leftCircuit !== rightCircuit) {
      rightCircuit.clear();
    }
  }

  return mostRecentLeft[0] * mostRecentRight[0];
};

run({
  part1: {
    tests: [
      {
        input: `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
