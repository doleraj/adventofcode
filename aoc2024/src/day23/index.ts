import run from "aocrunner";

type Node = { name: string, neighbors: Set<string> };

const parseInput = (rawInput: string) => rawInput
  .split("\n")
  .reduce((nodeMap, rawConnection) => {
    const [left, right] = rawConnection.split("-");
    let leftNode = nodeMap[left];
    if (!leftNode) {
      leftNode = { name: left, neighbors: new Set() };
      nodeMap[left] = leftNode;
    }

    let rightNode = nodeMap[right];
    if (!rightNode) {
      rightNode = { name: right, neighbors: new Set() };
      nodeMap[right] = rightNode;
    }

    leftNode.neighbors.add(right);
    rightNode.neighbors.add(left);
    return nodeMap;
}, {} as Record<string, Node>);

const intersection = <T>(set: Set<T>, otherSet: Set<T>) => {
  let result = new Set<T>();

  otherSet.forEach(value => {
    if (set.has(value)) {
      result.add(value);
    }
  });

  return result;
}

const bronKerbosch = (clique: Set<Node>, candidates: Set<string>, excludedCandidates: Set<string>, nodeMap: Record<string, Node>, cliques: Node[][]) => {
  if (candidates.size === 0 && excludedCandidates.size === 0) {
    cliques.push(Array.from(clique));
  }

  for (const candidateName of candidates) {
    const candidate = nodeMap[candidateName];
    const newCandidates = intersection(candidates, new Set(candidate.neighbors));
    const newExcluded = intersection(excludedCandidates, new Set(candidate.neighbors));
    const newClique = new Set(clique).add(candidate);

    bronKerbosch(newClique, newCandidates, newExcluded, nodeMap, cliques);

    candidates.delete(candidateName);
    excludedCandidates.add(candidateName);
  }
}

const combinations = <T>(array: T[], desiredLength: number, previousArray: T[]) => {
  if (previousArray.length === desiredLength) {
    return [previousArray];
  }

  const combos: T[][] = [];
  array.forEach((item, index) => {
    let nextArray = previousArray.slice();
    nextArray.push(item);
    combos.push(...combinations(array.slice(index + 1), desiredLength, nextArray));
  });

  return combos;
}

const part1 = (rawInput: string) => {
  const nodeMap = parseInput(rawInput);

  const cliques: Node[][] = [];
  bronKerbosch(new Set(), new Set(Object.keys(nodeMap)), new Set(), nodeMap, cliques);

  const justRightCliques = cliques.filter(clique => clique.length === 3);
  const tooBigCliques = cliques.filter(clique => clique.length > 3);

  tooBigCliques.forEach(tooBigClique => {
    justRightCliques.push(...combinations(tooBigClique, 3, []));
  });

  const validCliques = justRightCliques
    .filter(clique => clique.some(computer => computer.name.startsWith("t")));

  const uniqueCliques = new Set(validCliques.map(clique => {
    clique.sort((a, b) => a.name.localeCompare(b.name));
    return `${clique[0].name}-${clique[1].name}-${clique[2].name}`;
  }));

  return uniqueCliques.size;
};

const part2 = (rawInput: string) => {
  const nodeMap = parseInput(rawInput);

  const cliques: Node[][] = [];
  bronKerbosch(new Set(), new Set(Object.keys(nodeMap)), new Set(), nodeMap, cliques);

  cliques.sort((a, b) => b.length - a.length);

  const sortedNames = cliques[0].map(c => c.name);
  sortedNames.sort();
  return sortedNames.join(",");
};

run({
  part1: {
    tests: [
      {
        input: `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: 7,
      },
    ],
    // 1376 too high
    // 1162 too high
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
        `,
        expected: "co,de,ka,ta",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
