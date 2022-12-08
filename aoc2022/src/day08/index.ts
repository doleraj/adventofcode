import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const generateFindTreeDistance = (treeHeight: number) => {
  return (status: { distance: number, stopped: boolean }, currentTree: number) => {
    if (!status.stopped) {
      status.distance++;
    }

    if (currentTree >= treeHeight) {
      status.stopped = true;
    }

    return status;
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const treeMap = input.split("\n").map(treeLine => treeLine.split("").map(Number));
  const hMax = treeMap[0].length;
  const vMax = treeMap.length;

  const visibleTreeMap = treeMap.map((hTreeLine, vIndex) => {
    // console.log(hTreeLine);
    return hTreeLine.filter((treeHeight, hIndex) => {
      if (vIndex === 0 || vIndex === vMax || hIndex === 0 || hIndex === hMax) {
        return true;
      }

      const vTreeLine = treeMap.flatMap(treeLine => treeLine[hIndex]);
      const leftTrees = hTreeLine.slice(0, hIndex);
      const rightTrees = hTreeLine.slice(hIndex + 1);
      const topTrees = vTreeLine.slice(0, vIndex);
      const bottomTrees = vTreeLine.slice(vIndex + 1);
      const visibleOnLeft = treeHeight > Math.max(...leftTrees);
      const visibleOnRight = treeHeight > Math.max(...rightTrees);
      const visibleOnTop = treeHeight > Math.max(...topTrees);
      const visibleOnBottom = treeHeight > Math.max(...bottomTrees);

      // console.log(`${treeHeight} - (${leftTrees} - ${visibleOnLeft}) - (${rightTrees} - ${visibleOnRight})`);
      // console.log(`${treeHeight} - (${topTrees} - ${visibleOnTop}) - (${bottomTrees} - ${visibleOnBottom})`);
      return visibleOnTop || visibleOnBottom || visibleOnLeft || visibleOnRight;
    });
  });
  return visibleTreeMap.flatMap(_ => _).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const treeMap = input.split("\n").map(treeLine => treeLine.split("").map(Number));
  const hMax = treeMap[0].length;
  const vMax = treeMap.length;

  const treeScoreMap = treeMap.map((hTreeLine, vIndex) => {
    // console.log(hTreeLine);
    return hTreeLine.map((treeHeight, hIndex) => {
      if (vIndex === 0 || vIndex === vMax || hIndex === 0 || hIndex === hMax) {
        return 0;
      }

      const vTreeLine = treeMap.flatMap(treeLine => treeLine[hIndex]);

      const leftTrees = hTreeLine.slice(0, hIndex);
      const rightTrees = hTreeLine.slice(hIndex + 1);
      const topTrees = vTreeLine.slice(0, vIndex);
      const bottomTrees = vTreeLine.slice(vIndex + 1);
      const leftViewingDistance = leftTrees.reverse().reduce(generateFindTreeDistance(treeHeight), { distance: 0, stopped: false }).distance;
      const rightViewingDistance = rightTrees.reduce(generateFindTreeDistance(treeHeight), { distance: 0, stopped: false }).distance;
      const topViewingDistance = topTrees.reverse().reduce(generateFindTreeDistance(treeHeight), { distance: 0, stopped: false }).distance;
      const bottomViewingDistance = bottomTrees.reduce(generateFindTreeDistance(treeHeight), { distance: 0, stopped: false }).distance;

      // console.log(`${treeHeight} - (${leftTrees} - ${leftViewingDistance}) - (${rightTrees} - ${rightViewingDistance})`);
      // console.log(`${treeHeight} - (${topTrees} - ${topViewingDistance}) - (${bottomTrees} - ${bottomViewingDistance})`);

      return leftViewingDistance * rightViewingDistance * topViewingDistance * bottomViewingDistance;
    });
  });

  // console.log(treeScoreMap);
  return Math.max(...treeScoreMap.map(treeScoreLine => Math.max(...treeScoreLine)));
};

run({
  part1: {
    tests: [
      {
        input: `
30373
25512
65332
33549
35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
30373
25512
65332
33549
35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
