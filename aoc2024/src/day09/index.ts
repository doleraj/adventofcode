import run from "aocrunner";

const parseInput = (rawInput: string) => {
  let isBlank = true;
  let index = 0;
  const sizes: Record<number, number> = {};
  const diskArray = rawInput.split("").map(char => {
    const value = Number.parseInt(char);
    isBlank = !isBlank;
    if (isBlank) {
      return new Array<number>(value).fill(-1);
    } else {
      sizes[index] = value;
      return new Array<number>(value).fill(index++);
    }

  }).flat(1);
  return { diskArray, maxIndex: index - 1, sizes };
}

const checksum = (diskArray: number[]) => {
  return diskArray.reduce((acc, val, idx) => {
    if (val != -1) {
      return acc + (val * idx);
    } else {
      return acc;
    }
  }, 0);
}

const part1 = (rawInput: string) => {
  const { diskArray } = parseInput(rawInput);

  while (diskArray.filter(val => val == -1).length > 0) {
    const movedVal = diskArray.splice(diskArray.length - 1, 1)[0];
    const firstEmptyIndex = diskArray.indexOf(-1);
    diskArray[firstEmptyIndex] = movedVal;
  }

  return checksum(diskArray);
};

const part2 = (rawInput: string) => {
  const { diskArray, maxIndex, sizes } = parseInput(rawInput);
  let fileIndexToCheck = maxIndex;

  while (fileIndexToCheck > 0) {
    const fileSize = sizes[fileIndexToCheck];
    const currentIndexOfFile = diskArray.indexOf(fileIndexToCheck);
    const indexOfSpace = diskArray.findIndex((value, idx, array) => {
      if (idx > array.length - (fileSize - 1))  {
        return false;
      }

      let i = 1;
      let enoughSpace = value == -1;
      while (enoughSpace && i < fileSize) {
        enoughSpace = array[idx + i] == -1;
        i++;
      }
      return enoughSpace;
    });
    // console.log(`Found ${indexOfSpace} for file id ${fileIndexToCheck}`);

    if (indexOfSpace != -1 && indexOfSpace < currentIndexOfFile) {
      const file = diskArray.splice(currentIndexOfFile, fileSize, ...new Array<number>(fileSize).fill(-1));

      for (let i = 0; i < fileSize; i++) {
        diskArray[indexOfSpace + i] = file[i];
      }
    }
    // console.log(diskArray.map(val => val == -1 ? "." : val.toString()).join(""));
    fileIndexToCheck--;
  }
  // console.log(diskArray.map(val => val == -1 ? "." : val.toString()).join(""));

  return checksum(diskArray);
};

run({
  part1: {
    tests: [
      {
        input: `12345`,
        expected: 60,
      },
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
