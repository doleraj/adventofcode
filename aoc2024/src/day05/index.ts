import run from "aocrunner";

type Orderings = Record<string, { before: number[], after: number[] }>;
interface Update { original: string; parsed: number[] };

const parseInput = (rawInput: string) => {
  const [ruleChunk, updateChunk] = rawInput.split("\n\n");

  const rules = ruleChunk.split("\n").map(line => line.split("|").map(num => Number.parseInt(num, 10)));
  const updates: Update[] = updateChunk.split("\n").map(line => {
    return { original: line, parsed: line.split(",").map(num => Number.parseInt(num, 10)) };
  });

  const orderings: Orderings = {};
  rules.forEach((rule) => {
    if (!orderings[rule[0]]) { orderings[rule[0]] = { after: [], before: [] }; }
    if (!orderings[rule[1]]) { orderings[rule[1]] = { after: [], before: [] }; }

    const afterList = orderings[rule[0]].after;
    const beforeList = orderings[rule[1]].before;

    afterList.push(rule[1]);
    beforeList.push(rule[0]);
  })

  return { orderings, updates };
}

const isCorrectUpdate = (update: Update, orderings: Orderings) => {
  for (const page of update.parsed) {
    const orderingsForPage = orderings[page];
    const [beforeChunk, afterChunk] = update.original.split(page.toString());
    const beforeChunkContainsAfterPages = orderingsForPage.after.some(afterPage => {
      return update.parsed.includes(afterPage) ? beforeChunk.includes(afterPage.toString()) : false;
    });
    const afterChunkContainsAfterPages = orderingsForPage.after.every(afterPage => {
      return update.parsed.includes(afterPage) ? afterChunk.includes(afterPage.toString()) : true;
    });
    const afterChunkContainsBeforePages = orderingsForPage.before.some(beforePage => {
      return update.parsed.includes(beforePage) ? afterChunk.includes(beforePage.toString()) : false;
    });
    const beforeChunkContainsBeforePages = orderingsForPage.before.every(beforePage => {
      return update.parsed.includes(beforePage) ? beforeChunk.includes(beforePage.toString()) : true;
    });

    if (beforeChunkContainsAfterPages && afterChunkContainsBeforePages) {
      return false;
    }

    if (!afterChunkContainsAfterPages || !beforeChunkContainsBeforePages) {
      return false;
    }
  }

  return true;
}

const part1 = (rawInput: string) => {
  const { orderings, updates } = parseInput(rawInput);

  return updates.reduce((acc, curr) => {
    const updateIsCorrect = isCorrectUpdate(curr, orderings);

    if (!updateIsCorrect) {
      return acc;
    }

    // Lol, lmao
    const midIndex = Math.floor(curr.parsed.length / 2);
    return acc + curr.parsed[midIndex]
  }, 0);
};

const part2 = (rawInput: string) => {
  const { orderings, updates } = parseInput(rawInput);

  return updates.reduce((acc, curr) => {
    const updateIsCorrect = isCorrectUpdate(curr, orderings);

    if (updateIsCorrect) {
      return acc;
    }

    const sorted = curr.parsed.sort((a, b) => {
      const aOrderings = orderings[a];
      const bOrderings = orderings[b];

      if (aOrderings.after.includes(b) || bOrderings.before.includes(a)) {
        return -1;
      } else if (aOrderings.before.includes(b) || bOrderings.after.includes(a)) {
        return 1;
      } else {
        return 0;
      }
    });

    // Lol, lmao
    const midIndex = Math.floor(sorted.length / 2);
    return acc + sorted[midIndex]
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
