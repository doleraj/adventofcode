import run from "aocrunner";
import { create } from "domain";
import { it } from "node:test";

const parseInput = (rawInput: string) => rawInput;

interface Monkey {
  items: number[];
  operation: (val: number) => number;
  denominator: number;
  trueMonkeyIndex: number;
  falseMonkeyIndex: number;
  inspections: number;
}

const createMonkeys = (input: string): Monkey[] => {
  const monkeys: Monkey[] = [];
  const lines = input.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    if (lines[lineIndex].startsWith("Monkey")) {
      const startingItemsLine = lines[++lineIndex];
      const startingItems = startingItemsLine.substring("  Starting items: ".length).split((", ")).map(Number);

      const operationLine = lines[++lineIndex];
      const operationMatch = operationLine.match(/\s?Operation: new = old ([+*]) (old|\d+)/);
      let operation;
      if (operationMatch!![2] === "old") {
        if (operationMatch!![1] === "+") {
          operation = (val: number) => val + val;
        } else {
          operation = (val: number) => val * val;
        }
      } else {
        const other = Number(operationMatch!![2]);
        if (operationMatch!![1] === "+") {
          operation = (val: number) => val + other;
        } else {
          operation = (val: number) => val * other;
        }
      }

      const testLine = lines[++lineIndex];
      const testMatch = testLine.match(/\s?Test: divisible by (\d+)/);

      const trueMonkeyLine = lines[++lineIndex];
      const trueMonkeyMatch = trueMonkeyLine.match(/\s?If true: throw to monkey (\d+)/);

      const falseMonkeyLine = lines[++lineIndex];
      const falseMonkeyMatch = falseMonkeyLine.match(/\s?If false: throw to monkey (\d+)/);

      monkeys.push({
        items: startingItems,
        operation: operation,
        denominator: Number(testMatch!![1]),
        trueMonkeyIndex: Number(trueMonkeyMatch!![1]),
        falseMonkeyIndex: Number(falseMonkeyMatch!![1]),
        inspections: 0,
      });
    }
  }

  return monkeys;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let round = 0;
  const monkeys = createMonkeys(input);

  while (round < 20) {
    monkeys.forEach((monkey, monkeyIndex) => {
      // console.log(`Monkey ${monkeyIndex}:`);
      monkey.items.forEach((item, itemIndex) => {
        // console.log(`  Monkey inspects an item with a worry level of ${item}.`);
        const newWorryVal = monkey.operation(item);
        // console.log(`    Worry level becomes ${newWorryVal}.`);
        const boredWorryVal = Math.floor(newWorryVal / 3);
        // console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${boredWorryVal}.`);
        let nextMonkeyIndex;
        if (boredWorryVal % monkey.denominator) {
          // console.log(`     Current worry level is not divisible by ${monkey.denominator}`);
          nextMonkeyIndex = monkey.falseMonkeyIndex;
        } else {
          // console.log(`     Current worry level is divisible by ${monkey.denominator}`);
          nextMonkeyIndex = monkey.trueMonkeyIndex;
        }
        monkeys[nextMonkeyIndex].items.push(boredWorryVal);
        monkey.inspections++;
        // console.log(`     Item with worry level ${boredWorryVal} is thrown to monkey ${nextMonkeyIndex}`);
      })
      monkey.items = [];
    });
    round++;
  }
  // console.log(`After round ${round}, the monkeys are holding items with these worry levels:`)
  // console.log(monkeys.map((monkey, index) => `Monkey ${index}: ${monkey.items.join(", ")}`).join("\n"));

  const inspectionCounts = monkeys.map(monkey => monkey.inspections).sort((a, b) => b - a);
  // console.log(inspectionCounts);
  return inspectionCounts[0] * inspectionCounts[1];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`,
        expected: 10605,
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
