import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const times = Array.from(lines[0].split(":")[1]!!.matchAll(/\d+/g)).map(match => Number.parseInt(match[0]));
  const distances = Array.from(lines[1].split(":")[1]!!.matchAll(/\d+/g)).map(match => Number.parseInt(match[0]));
  return { times, distances };
}

const part1 = (rawInput: string) => {
  const { times, distances } = parseInput(rawInput);
  // console.log(times)
  // console.log(distances)

  const raceResults = [];
  for (let i = 0; i < times.length; i++) {
    const raceTime = times[i];
    const raceDistance = distances[i];
    let winningMethods = 0;

    for (let holdTime = 1; holdTime < raceTime; holdTime++) {
      const timeLeft = raceTime - holdTime;
      const distanceTraveled = holdTime * timeLeft;
      if (distanceTraveled > raceDistance) {
        winningMethods++;
      }
    }
    raceResults.push(winningMethods);
  }
  console.log(raceResults);

  return raceResults.reduce((previousValue, currentValue) => previousValue * currentValue, 1);
};

const part2 = (rawInput: string) => {
  const { times, distances } = parseInput(rawInput);
  const raceResults = [];
  const raceTime = Number.parseInt(times.reduce((prev, curr) => prev + curr, ""));
  const raceDistance = Number.parseInt(distances.reduce((prev, curr) => prev + curr, ""));

  // console.log(raceTime)
  // console.log(raceDistance)
  let winningMethods = 0;

  for (let holdTime = 1; holdTime < raceTime; holdTime++) {
    const timeLeft = raceTime - holdTime;
    const distanceTraveled = holdTime * timeLeft;
    if (distanceTraveled > raceDistance) {
      winningMethods++;
    }
  }
  raceResults.push(winningMethods);
  // console.log(raceResults);

  return raceResults.reduce((previousValue, currentValue) => previousValue * currentValue, 1);
};

run({
  part1: {
    tests: [
      {
        input: `
Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Time:      71530
Distance:  940200`,
        expected: 71503,
      },
      {
        input: `
Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
