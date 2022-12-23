import run from "aocrunner";

interface FileNumber {
  originalPosition: number;
  value: number;
}

const parseInput = (rawInput: string): FileNumber[] => {
  return rawInput.split("\n").map(Number).map((num, index) => {
    return { value: num, originalPosition: index };
  });
}

const part1 = (rawInput: string) => {
  const numbers = parseInput(rawInput);
  let originalNumberIndex = 0;
  while (originalNumberIndex < numbers.length) {
    const indexInActualArray = numbers.findIndex(number => number.originalPosition === originalNumberIndex);
    const nextNum = numbers.splice(indexInActualArray, 1)[0];
    const insertIndex = (indexInActualArray + nextNum.value) % numbers.length;

    // console.log(`Actual index: ${indexInActualArray}`);
    // console.log(`Insert index + val: ${indexInActualArray + nextNum.value}`);
    // console.log(`Insert index: ${insertIndex}`);
    // console.log(numbers.length);
    numbers.splice(insertIndex, 0, nextNum);
    // console.log(numbers.map(num => num.value));
    originalNumberIndex++;
  }

  const indexOfZeroValue = numbers.findIndex(num => num.value === 0);
  const coordinate1 = numbers[(indexOfZeroValue + 1000) % numbers.length].value;
  const coordinate2 = numbers[(indexOfZeroValue + 2000) % numbers.length].value;
  const coordinate3 = numbers[(indexOfZeroValue + 3000) % numbers.length].value;
  return coordinate1 + coordinate2 + coordinate3;
};

function mix(numbers: FileNumber[]) {
  let originalNumberIndex = 0;
  while (originalNumberIndex < numbers.length) {
    const indexInActualArray = numbers.findIndex(number => number.originalPosition === originalNumberIndex);
    const nextNum = numbers.splice(indexInActualArray, 1)[0];
    const insertIndex = (indexInActualArray + nextNum.value) % numbers.length;

    // console.log(`Actual index: ${indexInActualArray}`);
    // console.log(`Insert index + val: ${indexInActualArray + nextNum.value}`);
    // console.log(`Insert index: ${insertIndex}`);
    // console.log(numbers.length);
    numbers.splice(insertIndex, 0, nextNum);
    // console.log(numbers.map(num => num.value));
    originalNumberIndex++;
  }
}

const part2 = (rawInput: string) => {
  const numbers = parseInput(rawInput);
  numbers.forEach(num => num.value = num.value * 811589153);

  // const mutatedList = [...numbers];
  let mixCount = 0
  while (mixCount < 10) {
    mix(numbers);
    mixCount++;
  }

  const indexOfZeroValue = numbers.findIndex(num => num.value === 0);
  const coordinate1 = numbers[(indexOfZeroValue + 1000) % numbers.length].value;
  const coordinate2 = numbers[(indexOfZeroValue + 2000) % numbers.length].value;
  const coordinate3 = numbers[(indexOfZeroValue + 3000) % numbers.length].value;
  return coordinate1 + coordinate2 + coordinate3;
};

run({
  part1: {
    tests: [
      {
        input: `
 1
2
-3
3
-2
0
4
 `,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
         1
2
-3
3
-2
0
4
 `,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
