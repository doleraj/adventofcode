import run from "aocrunner";
import "../utils/index.js";

type Rule = { rule: string; dest: string; };
type Part = { x: number; m: number; a: number; s: number; };
type Workflow = { name: string; rules: Rule[], lastRule: string; };

const parseInput = (rawInput: string) => {
  const splits = rawInput.split("\n\n");
  const workflows: Workflow[] = splits[0].split("\n").map(line => {
    const matches = line.match(/([a-z]+)\{((?:[\w<>]+:\w+,?)+),(\w+)}/)!!;
    const rules= matches[2].split(",").map(ruleStr => {
      const ruleSplit = ruleStr.split(":");
      return { rule: ruleSplit[0], dest: ruleSplit[1] };
    });
    return { name: matches[1], rules, lastRule: matches[3] };
  });

  const parts: Part[] = splits[1].split(("\n")).map(line => {
    const matches = line.match(/\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/)!!;
    return { x: Number.parseInt(matches[1]), m: Number.parseInt(matches[2]), a: Number.parseInt(matches[3]), s: Number.parseInt(matches[4]) }
  });

  return { workflows, parts };
}

const runRules = (part: Part, workflow: Workflow) => {
  const x = part.x;
  const m = part.m;
  const a = part.a;
  const s = part.s;

  for (let i = 0; i < workflow.rules.length; i++) {
    const rule = workflow.rules[i];
    // I AM A CHRISTMAS MONSTER! But I couldn't pass up the chance to do this
    if (eval(rule.rule)) {
      return rule.dest;
    }
  }

  return workflow.lastRule;
};

const part1 = (rawInput: string) => {
  const { workflows, parts } = parseInput(rawInput);
  const inFlow = workflows.find(w => w.name === "in")!!;

  const partVals = parts.map(part => {
    let workflow = inFlow;
    while (workflow) {
      const dest = runRules(part, workflow);
      if (dest === "A") {
        // console.log(`Part ${JSON.stringify(part)} accepted`);
        return part.x + part.m + part.a + part.s;
      } else if (dest === "R") {
        // console.log(`Part ${JSON.stringify(part)} rejected`);
        return 0;
      } else {
        workflow = workflows.find(w => w.name === dest)!!;
      }
    }
    return -1;
  });

  // console.log(partVals);
  return partVals.reduce((sum, partVal) => sum + partVal);
};

type Range = Record<string, [number, number]>;
type ProcessedRule = { property?: string; symbol?: string; value?: number; dest: string; };
type ProcessedWorkflow = ProcessedRule[];
const copyRange = (range: Range) => {
  return JSON.parse(JSON.stringify(range));
};

const getRuleRanges = (name: string, range: Range, workflows: Record<string, ProcessedWorkflow>): Range[] => {
  if (name === "R") {
    return [];
  }
  if (name === "A") {
    return [copyRange(range)];
  }

  const workFlow = workflows[name];
  const ranges = [];
  for (const rule of workFlow) {
    if (!rule.symbol) {
      ranges.push(...getRuleRanges(rule.dest, copyRange(range), workflows));
    }

    if (rule.symbol === "<") {
      const newRange = copyRange(range);
      newRange[rule.property!!][1] = rule.value!! - 1;
      ranges.push(...getRuleRanges(rule.dest, newRange, workflows));
      range[rule.property!!][0] = rule.value!!;
    }

    if (rule.symbol === ">") {
      const newRange = copyRange(range);
      newRange[rule.property!!][0] = rule.value!! + 1;
      ranges.push(...getRuleRanges(rule.dest, newRange, workflows));
      range[rule.property!!][1] = rule.value!!;
    }
  }

  // console.log(`Resulting ranges: ${JSON.stringify(ranges)}`);
  return ranges;
};

const getRuleCombos = (firstWorkflow: string, workflows: Record<string, ProcessedWorkflow>) => {
  const range: Range = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };

  return getRuleRanges(firstWorkflow, range, workflows)
      .map((range) =>
          Object.values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1)
      )
      .reduce((acc: number, v: number) => acc + v, 0);
};

const part2 = (rawInput: string) => {
  const { workflows } = parseInput(rawInput);
  const ruleRegex = /([xmas])([<>])(\d+)/;

  // First process through the workflow rules.
  const processedWorkflows: Record<string, ProcessedWorkflow> = {};
  workflows.forEach(workflow => {
    const parsedRules: ProcessedRule[] = workflow.rules.map(rule => {
      const ruleParts = rule.rule.match(ruleRegex)!!;
      return { property: ruleParts[1], symbol: ruleParts[2], value: Number.parseInt(ruleParts[3]), dest: rule.dest };
    });
    parsedRules.push({ dest: workflow.lastRule });

    processedWorkflows[workflow.name] = parsedRules;
  });

  // Then combine.
  return getRuleCombos("in", processedWorkflows);
};

run({
  part1: {
    tests: [
      {
        input: `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
