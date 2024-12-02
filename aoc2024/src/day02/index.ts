import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => line.split(" ").map(val => parseInt(val, 10)));
}

interface LevelCheck {
  isSafe: boolean;
  previousLevel?: number;
  previousDelta?: number;
}

const isReportSafe = (report: number[]): boolean => {
  const deltas = report.slice(1).map((val, idx) => val - report[idx]);
  const deltasMatch = deltas.slice(1).reduce((accum, delta, idx) => accum && Math.sign(delta) == Math.sign(deltas[idx]), true);
  const deltasWithinRange = deltas.reduce((accum, delta) => accum && Math.abs(delta) > 0 && Math.abs(delta) < 4, true);

  return deltasMatch && deltasWithinRange;
}

const part1 = (rawInput: string) => {
  const reports = parseInput(rawInput);

  return reports.reduce((safeLevels, report) => {

    const reportSafe = isReportSafe(report);
    return reportSafe ? safeLevels + 1 : safeLevels;
  }, 0);
};

const part2 = (rawInput: string) => {
  const reports = parseInput(rawInput);

  return reports.reduce((safeLevels, report) => {

    const reportSafe = isReportSafe(report);
    let atLeastOneSubreportSafe = false;
    if (!reportSafe) {
      const subreports = report.map((_, idx) => {
        const newReport = [...report];
        newReport.splice(idx, 1)
        return newReport;
      });
      atLeastOneSubreportSafe = subreports.some(subreport => isReportSafe(subreport));
    }

    return (reportSafe || atLeastOneSubreportSafe) ? safeLevels + 1 : safeLevels;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
      {
        input: `4 8 9 11 12 15`,
        expected: 0,
      },
    ],
    /// 333 too high
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
