import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n")
  .map((line) => line.split(",").map(c => Number.parseInt(c, 10)));

const part1 = (rawInput: string) => {
  const coords = parseInput(rawInput);

  let maxArea = 0;
  for (let i = 1; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const left = coords[i];
      const right = coords[j];
      const area = Math.abs(left[0] - right[0] + 1) * Math.abs(left[1] - right[1] + 1);
      maxArea = Math.max(maxArea, area)
    }
  }

  return maxArea;
};

const orient= (a: number[], b: number[], c: number[]) => {
  return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
}

const twoLinesIntersect = (a1: number[], a2: number[],  b1: number[], b2: number[]) => {
  const oa = orient(b1, b2, a1);
  const ob = orient(b1, b2, a2);
  const oc = orient(a1, a2, b1);
  const od = orient(a1, a2, b2);
  // Proper intersection exists iff opposite signs
  return (oa * ob < 0 && oc * od < 0);
}

const boxIntersects = (point1: number[], point2: number[], xMin: number, xMax: number, yMin: number, yMax: number) => {
  return twoLinesIntersect(point1, point2, [xMin, yMin], [xMin, yMax]) ||
    twoLinesIntersect(point1, point2, [xMin, yMax], [xMax, yMax]) ||
    twoLinesIntersect(point1, point2, [xMax, yMax], [xMax, yMin]) ||
    twoLinesIntersect(point1, point2, [xMax, yMin], [xMin, yMin]);
};

function doesRectangleIntersectVertices(vertices: number[][], xMin: number, yMin: number, xMax: number, yMax: number) {
  let firstVertex = vertices[0];
  for (let k = 1; k <= vertices.length; k++) {
    const secondVertex = k === vertices.length ? vertices[0] : vertices[k];

    // console.log(`Checking ${firstVertex} ${secondVertex} against (${xMin}, ${yMin}), (${xMax},${yMax})`);
    if (boxIntersects(firstVertex, secondVertex, xMin, xMax, yMin, yMax)) {
      // console.log(`(${xMin}, ${yMin}), (${xMax},${yMax}) first: ${firstVertex} second: ${secondVertex}`);
      // console.log("Intersection found");
      return true;
    }

    firstVertex = secondVertex;
  }
  return false;
}

const part2 = (rawInput: string) => {
  const vertices = parseInput(rawInput);

  let maxArea = 0;
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const xMin = Math.min(vertices[i][0], vertices[j][0]);
      const xMax = Math.max(vertices[i][0], vertices[j][0]);
      const yMin = Math.min(vertices[i][1], vertices[j][1]);
      const yMax = Math.max(vertices[i][1], vertices[j][1]);

      // console.log(`Checking rectangle (${xMin}, ${yMin}), (${xMax},${yMax})`);
      if (!doesRectangleIntersectVertices(vertices, xMin, yMin, xMax, yMax)) {
        const area = Math.abs(xMin - xMax + 1) * Math.abs(yMin - yMax + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
};

// 4743369984 too high
// 2248965054 too high
// 1528797888 too low

run({
  part1: {
    tests: [
      {
        input: `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
        expected: 24,
      },
      {
        input: `
11,1
11,9
9,9
9,7
5,7
5,9
2,9
2,3
7,3
7,1`,
        expected: 40,
      },
      {
        input: `
11,1
11,13
9,13
9,11
2,11
2,9
9,9
9,6
2,6
2,3
7,3
7,1`,
        expected: 39,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
