import run from "aocrunner";

Array.prototype.toString = function() {
  return `[${this.join(",")}]`;
}

const parseInput = (rawInput: string) => {
  const arrays = rawInput
    .split("\n")
    .map(line => {
      if (line.trim()) {
        return JSON.parse(line);
      } else {
        return null;
      }
    });

  const pairs = [];
  while(arrays.length > 0) {
    pairs.push([arrays.pop(), arrays.pop()].reverse());
    arrays.pop();
  }

  return pairs.reverse();
}

const pairsInRightOrder = (left: any, right: any): number => {
  // console.log(`Compare ${left} vs ${right}`);
  if ((typeof left) === "number" && (typeof right) === "number") {
    if (left < right) {
      // console.log("Left side is smaller, so inputs are in the right order");
      return -1;
    } else if (left > right) {
      // console.log("Right side is smaller, so inputs are not in the right order");
      return 1;
    } else {
      return 0;
    }
  } else if ((typeof left) === "number" && right instanceof Array) {
    return pairsInRightOrder([left], right);
  } else if (left instanceof Array && (typeof right) === "number") {
    return pairsInRightOrder(left, [right]);
  } else if (left instanceof Array && right instanceof Array) {
    for (let i = 0; i < left.length; i++) {
      if (i >= right.length) {
        // console.log("Right side ran out of items, so inputs are not in the right order");
        return 1;
      } else {
        const val = pairsInRightOrder(left[i], right[i]);
        if (val !== 0) {
          return val;
        }
      }
    }

    if (right.length > left.length) {
      // console.log("Left side ran out of items, so inputs are in the right order");
      return -1;
    } else {
      return 0;
    }
  } else {
    throw new Error("You jacked up the input somewhere.");
  }
}

const part1 = (rawInput: string) => {
  const arrayPairs = parseInput(rawInput);
  const pairOrdering = arrayPairs.map(pair => pairsInRightOrder(pair[0], pair[1]));
  return pairOrdering
    .map((pairResult, index) => pairResult < 0 ? index + 1 : null)
    .filter((v): v is number => v !== null)
    .reduce((accum, value) => accum + value);
};

const part2 = (rawInput: string) => {
  const arrayPairs = parseInput(rawInput);
  const arrays = arrayPairs.flat(1);
  const firstDividerPacket = [[2]];
  const secondDividerPacket = [[6]];
  arrays.push(firstDividerPacket);
  arrays.push(secondDividerPacket);
  const sortedArrays = arrays.sort(pairsInRightOrder);

  const firstDividerIndex = sortedArrays.findIndex(value => value === firstDividerPacket) + 1;
  const secondDividerIndex = sortedArrays.findIndex(value => value === secondDividerPacket) + 1;
  return firstDividerIndex * secondDividerIndex;
};

run({
  part1: {
    tests: [
      {
        input: `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
