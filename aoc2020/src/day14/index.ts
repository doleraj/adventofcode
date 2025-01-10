import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const memory: Record<number, bigint> = {};
  const valueSetRegex = /mem\[(\d+)] = (\d+)/;

  let bitMask = new Map<number, bigint>();
  for (let line of lines) {
    if (line.startsWith("mask")) {
      bitMask.clear();
      line.substring(7).split("").reverse().forEach((char, index) => {
        if (char !== "X") {
          bitMask.set(index, BigInt(char));
        }
      });
    } else {
      const match = line.match(valueSetRegex)!!;
      const address = Number.parseInt(match[1]);
      let value = BigInt(match[2]);

      for (let maskBit of bitMask.entries()) {
        if (maskBit[1] === 1n) {
          value = value | 1n << BigInt(maskBit[0]);
        } else {
          value = value & ~(1n << BigInt(maskBit[0]));
        }
      }

      memory[address] = value;
    }
  }

  return Object.values(memory).reduce((acc, v) => acc + v, 0n).toString();
};

const setValueInMemory = (address: bigint, value: bigint, mask: number[], position: number, memory: Map<bigint, bigint>): void => {
  if (position === mask.length) {
    // console.log(`Writing ${value} to ${address.toString(2)}`);
    memory.set(address, value);
    return;
  }

  const len = mask.length - 1;
  if (mask[position] === 1) {
    const nextAddress = address | 1n << BigInt(len - position)
    return setValueInMemory(nextAddress, value, mask, position + 1, memory);
  } else if (mask[position] === 0) {
    return setValueInMemory(address, value, mask, position + 1, memory);
  } else if (mask[position] === -1) {
    const nextAddress1 = address | 1n << BigInt(len - position)
    setValueInMemory(nextAddress1, value, mask, position + 1, memory);
    const nextAddress2 = address & ~(1n << BigInt(len - position));
    setValueInMemory(nextAddress2, value, mask, position + 1, memory);
  }
}

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const memory = new Map<bigint, bigint>();
  const valueSetRegex = /mem\[(\d+)] = (\d+)/;

  let bitMask: number[] = [];
  for (let line of lines) {
    console.log(line);
    if (line.startsWith("mask")) {
      bitMask = line.substring(7).split("").map(char => {
        return char !== "X" ? Number.parseInt(char) : -1;
      });
    } else {
      const match = line.match(valueSetRegex)!!;
      let address = BigInt(match[1]);
      let value = BigInt(match[2]);

      setValueInMemory(address, value, bitMask, 0, memory);
    }
  }

  return Array.from(memory.values()).reduce((acc, v) => acc + v, 0n).toString();
};

run({
  part1: {
    tests: [
      {
        input: `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`,
        expected: "165",
      },
    ],
    // 174693088690 too low
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`,
        expected: "208",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
