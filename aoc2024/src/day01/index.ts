import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .map(line => line
                        .split("   ")
                        .map(num => parseInt(num, 10))
    )
    .reduce((accum, pair) => {
      accum[0].push(pair[0]);
      accum[1].push(pair[1]);
      return accum;
    }, [[] as number[], [] as number[]]);
}

const part1 = (rawInput: string) => {
  const [ listA, listB ] = parseInput(rawInput);

  listA.sort();
  listB.sort();

  return listA.reduce((totalDistance, aVal, currentIndex) => {
    const newDist = Math.abs(aVal - listB[currentIndex]);
    return totalDistance + newDist;
  }, 0);
};

const part2 = (rawInput: string) => {
  const [ listA, listB ] = parseInput(rawInput);
  listA.sort();
  listB.sort();
  const maxNum = Math.max(listA[listA.length - 1], listB[listB.length - 1]);

  const freqMap = listB.reduce((freqMap, bVal) => {
    freqMap[bVal] += 1;
    return freqMap;
  }, new Array<number>(maxNum + 1).fill(0));

  return listA.reduce((similarity, aVal) => {
    return  similarity + (aVal * freqMap[aVal]);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
