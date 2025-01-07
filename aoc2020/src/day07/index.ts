import run from "aocrunner";

type Bag = { name: string; childrenCounts: Record<string, number> };

const parseInput = (rawInput: string) => {
  const regex = /(no other bags.|(\d) ([\w ]+) bags*[ ,.]*)/g;
  return rawInput.split("\n").reduce((map, line) => {
    const bagChunks = line.split(" bags contain ");
    const firstBag = bagChunks[0];
    const matches = Array.from(bagChunks[1].matchAll(regex)!!);

    // console.log(`For ${firstBag}:`)
    const childrenCounts = matches.reduce((children, match) => {
      if (match[0] !== "no other bags.") {
        // console.log(match)
        children[match[3]] = Number.parseInt(match[2]);
      }
      return children;
    }, {} as Record<string, number>);

    map[firstBag] = { name: firstBag, childrenCounts }
    return map;
  }, {} as Record<string, Bag>);
}

const part1 = (rawInput: string) => {
  const bagMap = parseInput(rawInput);

  let possibleParentNames = new Set(["shiny gold"]);
  let possibleParentSet = new Set<string>();
  while (possibleParentNames.size > 0) {
    possibleParentNames = new Set(Array.from(possibleParentNames.values()).flatMap(parentName => {
      return Object.values(bagMap).filter(bag => Object.keys(bag.childrenCounts).includes(parentName)).map(bag => bag.name);
    }));
    // console.log(`Next set of parents: %o`, possibleParentNames);
    possibleParentNames.forEach((parentName) => {
      possibleParentSet.add(parentName);
    })
  }

  return possibleParentSet.size;
};

const getCountOfAllContainedBagsInBag= (bagName: string, bagMap: Record<string, Bag>): number => {
  const childrenCounts = Object.entries(bagMap[bagName].childrenCounts);
  const childrenCount = childrenCounts.reduce((count, entry) => {
    const numberOfThatTypeOfBag = entry[1];
    const countOfChildrenOfBag = getCountOfAllContainedBagsInBag(entry[0], bagMap);
    return count + (numberOfThatTypeOfBag * countOfChildrenOfBag);
  }, 0);

  return 1 + childrenCount;
};

const part2 = (rawInput: string) => {
  const bagMap = parseInput(rawInput);
  return getCountOfAllContainedBagsInBag("shiny gold", bagMap) - 1;
};

run({
  part1: {
    tests: [
      {
        input: `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`,
        expected: 4,
      },
    ],
    // 273 too high
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`,
        expected: 32,
      },
      {
        input: `
shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`,
        expected: 126,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
