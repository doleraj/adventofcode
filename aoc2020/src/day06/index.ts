import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput
  .split("\n\n")
  .map(chunk => {
    const answers = chunk.split("\n").flatMap(line => line.split(""))
    const people = chunk.split("\n").length;
    return { answers, people }
  });

const part1 = (rawInput: string) => {
  const groupAnswerSets = parseInput(rawInput);

  return groupAnswerSets.reduce((count, groupAnswers) => {
    return count + new Set(groupAnswers.answers).size;
  }, 0);
};

const part2 = (rawInput: string) => {
  const groupAnswerSets = parseInput(rawInput);

  return groupAnswerSets.reduce((count, groupAnswers) => {
    const answerCounts = groupAnswers.answers.reduce((map, entry) => {
      if (map[entry] === undefined) {
        map[entry] = 0;
      }
      map[entry]++;
      return map;
    }, {} as Record<string, number>);

    return count + Object.values(answerCounts).filter(count => count === groupAnswers.people).length;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
abc

a
b
c

ab
ac

a
a
a
a

b`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
abc

a
b
c

ab
ac

a
a
a
a

b`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
