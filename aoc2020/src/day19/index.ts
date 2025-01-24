import run from "aocrunner";

type RulePart = { textRules: string[], compositeRules: [] } | { textRules: [], compositeRules: number[] };
type Rule = { id: number, ruleParts: RulePart[] }

const parseInput = (rawInput: string) => {
  const [rawRules, rawMessages] = rawInput.split("\n\n");

  const rules: Rule[] = rawRules.split("\n").map(line => {
    const [ruleNumString, ruleString] = line.split(": ");

    const ruleParts: RulePart[] = ruleString.split(" | ").map(rulePart => {
      if (rulePart.startsWith("\"")) {
        return { textRules: [rulePart.slice(1, -1)], compositeRules: [] };
      } else {
        return { textRules: [], compositeRules: rulePart.split(" ").map(n => Number.parseInt(n)) };
      }
    });

    return { id: Number.parseInt(ruleNumString), ruleParts };
  });

  return { rules, messages: rawMessages.split("\n") }
}

const assembleRule = (id: number, rules: Rule[]): Set<string> => {
  const rule = rules.find((rule) => rule.id === id)!!;

  return new Set(rule.ruleParts.flatMap(part => {
    if (part.textRules.length > 0) {
      return part.textRules;
    } else {
      const newRules = part.compositeRules.reduce((newRules, nextSubRule) => {
        return Array.from(assembleRule(nextSubRule, rules)).flatMap(newBit => {
          return newRules.map(rule =>  rule + newBit);
        });
      }, [""]);
      part.textRules = newRules;
      return newRules;
    }
  }));
}

const part1 = (rawInput: string) => {
  const { rules, messages } = parseInput(rawInput);

  const rule0s = assembleRule(0, rules);
  return messages.filter(message => rule0s.has(message)).length;
};

const part2 = (rawInput: string) => {
  const { rules, messages } = parseInput(rawInput);
  const rule42 = Array.from(assembleRule(42, rules));
  const rule31 = Array.from(assembleRule(31, rules));

  const ruleLength = rule42[0].length;
  const rule42Regex = new RegExp(`((?:${Array.from(rule42).join("|")})+)`);
  const rule0Regex = new RegExp(`^(${Array.from(rule42).join("|")})+(${Array.from(rule31).join("|")})+$`);

  const matching = messages.filter(message => {
    const matches =  message.match(rule0Regex);

    if (!matches) {
      return false;
    }

    const rule42Length = message.match(rule42Regex)!![0].length;
    const rule42Count = rule42Length / ruleLength;
    const rule31Count = (message.length - rule42Length) / ruleLength;

    return rule42Count > rule31Count;
  });

  return matching.length;
};

run({
  part1: {
    tests: [
      {
        input: `
0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"

aab
aba`,
        expected: 2,
      },
      {
        input: `
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`,
        expected: 12,
      },
    ],
    // 275 too high
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
