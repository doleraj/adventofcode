import run from "aocrunner";

class Monkey {
  name: string;
  output?: number;
  operation?: string;
  waitMonkey1?: string;
  waitMonkey2?: string;
  constructor(name: string, output?: number, waitMonkey1?: string, waitMonkey2?: string, operation?: string) {
    this.name = name;
    if (output) {
      this.output = output;
    } else {
      this.operation = operation;
      this.waitMonkey1 = waitMonkey1;
      this.waitMonkey2 = waitMonkey2;
    }
  }

  isMonkeyReady(monkeys: Monkey[]): boolean {
    // console.log(`checking ready for monkey ${this.name}`);
    if (this.waitMonkey1 !== undefined && this.waitMonkey2 !== undefined) {
      const wm1 = monkeys.find(monkey => monkey.name === this.waitMonkey1!!)!!;
      const wm2 = monkeys.find(monkey => monkey.name === this.waitMonkey2!!)!!;
      // console.log(`${wm1.name} ${wm2.name}`)
      return wm1.isMonkeyReady(monkeys) && wm2.isMonkeyReady(monkeys);
    }
    return this.output !== undefined;
  }

  calculateOutput(monkeys: Monkey[]): number {
    if (this.output) {
      return this.output;
    }

    const wm1 = monkeys.find(monkey => monkey.name === this.waitMonkey1!!)!!;
    const wm2 = monkeys.find(monkey => monkey.name === this.waitMonkey2!!)!!;

    const wm1Value = wm1.calculateOutput(monkeys);
    const wm2Value = wm2.calculateOutput(monkeys);

    switch (this.operation) {
      case "+": return wm1Value!! + wm2Value!!;
      case "-": return wm1Value!! - wm2Value!!;
      case "*": return wm1Value!! * wm2Value!!;
      case "/": return wm1Value!! / wm2Value!!;
    }
    return -1;
  }

  calculateOutput2(monkeys: Monkey[]): number {
    if (this.name === "humn") {
      return NaN;
    }

    if (this.output) {
      return this.output;
    }
    const wm1 = monkeys.find(monkey => monkey.name === this.waitMonkey1!!)!!;
    const wm2 = monkeys.find(monkey => monkey.name === this.waitMonkey2!!)!!;

    const wm1Value = wm1.calculateOutput2(monkeys);
    const wm2Value = wm2.calculateOutput2(monkeys);

    if (this.name === "root") {
      if (isNaN(wm1Value)) {
        return wm1.findHumnValue(wm2Value, monkeys);
      }
      return wm2.findHumnValue(wm1Value, monkeys);
    }

    switch (this.operation) {
      case "+": return wm1Value!! + wm2Value!!;
      case "-": return wm1Value!! - wm2Value!!;
      case "*": return wm1Value!! * wm2Value!!;
      case "/": return wm1Value!! / wm2Value!!;
    }
    return -1;
  }

  findHumnValue(mustEqual: number, monkeys: Monkey[]): number {
    if (this.name === "humn") {
      return mustEqual;
    }
    if (this.output) {
      return this.output;
    }

    // console.log(`Checking equality value for ${this.name}.`)
    const wm1 = monkeys.find(monkey => monkey.name === this.waitMonkey1!!)!!;
    const wm2 = monkeys.find(monkey => monkey.name === this.waitMonkey2!!)!!;

    const wm1Value = wm1.calculateOutput2(monkeys);
    const wm2Value = wm2.calculateOutput2(monkeys);

    if (isNaN(wm1Value)) {
      switch (this.operation) {
        case "+": {
          // console.log(`Foo = ${mustEqual} - ${wm2Value} = ${mustEqual - wm2Value}`)
          return wm1.findHumnValue(mustEqual - wm2Value, monkeys);
        }
        case "-": {
          // console.log(`Foo = ${mustEqual} + ${wm2Value} = ${mustEqual + wm2Value}`)
          return wm1.findHumnValue(mustEqual + wm2Value, monkeys);
        }
        case "*": {
          // console.log(`Foo = ${mustEqual} / ${wm2Value} = ${mustEqual / wm2Value}`)
          return wm1.findHumnValue(mustEqual / wm2Value, monkeys);
        }
        case "/": {
          // console.log(`Foo = ${mustEqual} * ${wm2Value} = ${mustEqual * wm2Value}`)
          return wm1.findHumnValue(mustEqual * wm2Value, monkeys);
        }
      }
    } else {
      switch (this.operation) {
        case "+": {
          // console.log(`Foo = ${mustEqual} - ${wm1Value} = ${mustEqual - wm1Value}`);
          return wm2.findHumnValue(mustEqual - wm1Value, monkeys);
        }
        case "-": {
          // console.log(`Foo = ${wm1Value} - ${mustEqual} = ${wm1Value - mustEqual}`)
          return wm2.findHumnValue(wm1Value - mustEqual, monkeys);
        }
        case "*": {
          // console.log(`Foo = ${mustEqual} / ${wm1Value} = ${mustEqual / wm1Value}`)
          return wm2.findHumnValue(mustEqual / wm1Value, monkeys);
        }
        case "/": {
          // console.log(`Foo = ${wm1Value} / ${mustEqual} = ${wm1Value / mustEqual}`)
          return wm2.findHumnValue(wm1Value / mustEqual, monkeys);
        }
      }
    }

    return -1;
  }
}

const parseInput = (rawInput: string): Monkey[] => {
  return rawInput.split("\n").map(line => {
    const match = line.match(/([a-z]{4}): (?:(\d+)|([a-z]{4}) ([+\-*/]) ([a-z]{4}))/)!!;

    if (match[2]) {
      return new Monkey(match[1], Number(match[2]));
    } else {
      return new Monkey(match[1],undefined, match[3], match[5], match[4]);
    }
  });
}

const part1 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);
  const root = monkeys.find(monkey => monkey.name === "root")!!;
  return root.calculateOutput(monkeys);
};

const part2 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);
  const root = monkeys.find(monkey => monkey.name === "root")!!;
  return root.calculateOutput2(monkeys);
};

run({
  part1: {
    tests: [
      {
        input: `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
 `,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
 `,
        expected: 301,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
