import run from "aocrunner";
import "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.replace("\n", "").split(",");

const hash = (input: string) => {
  let currVal = 0;
  for (const char of input) {
    currVal += char.charCodeAt(0);
    currVal = currVal * 17;
    currVal = currVal % 256;
  }

  return currVal;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((valueSum, step) => {
    return valueSum + hash(step);
  }, 0);
};

type Lens = {
  label: string;
  focalLength: number;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const boxes = new Map<number, Lens[]>();

  input.forEach(instruction => {
    const matches = instruction.match(/(\w+)([=\-])(\d+)?/)!!;
    const label = matches[1];
    const boxIndex = hash(label);
    const operation = matches[2];
    // console.log(`label: ${label}, index: ${boxIndex}, operation: ${operation}`);

    if (operation === "=") {
      let box = boxes.get(boxIndex);
      if (!box) {
        box = [];
        boxes.set(boxIndex, box);
      }

      const focalLength = Number(matches[3]);
      const existingLens = box.find(lens => lens.label === label);
      if (existingLens) {
        existingLens.focalLength = focalLength;
      } else {
        box.push({
          label,
          focalLength
        });
      }

    } else if (operation === "-") {
      const box = boxes.get(boxIndex);
      if (!box) {
        boxes.set(boxIndex, []);
        return;
      }

      const indexOfLensInBox = box.findIndex(lens => lens.label === label);
      if (indexOfLensInBox !== -1) {
        box.splice(indexOfLensInBox, 1);
      }
    } else {
      throw Error("Heehoo peenut");
    }
  });

  // console.log(boxes);
  return Array.from(boxes.entries()).reduce((accum, [index, lenses]) => {
    const boxVal = 1 + index;

    return accum + lenses.reduce((lensTotal, lens, index) => {
      return lensTotal + boxVal * (index  + 1) * (lens.focalLength);
    }, 0);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `HASH`,
        expected: 52,
      },
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
