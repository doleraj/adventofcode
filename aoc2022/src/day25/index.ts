import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n");
}

function toSNAFU(value: number) {
  const base5 = value.toString(5).split("").map(Number).reverse().reduce((accum, val, index) => {
    if (!accum[index]) {
      accum[index] = val;
    } else {
      accum[index] += val;
    }

    if (accum[index] === 3) {
      accum[index] = -2;
      accum[index + 1] = 1;
    } else if (accum[index] === 4) {
      accum[index] = -1;
      accum[index + 1] = 1;
    } else if (accum[index] === 5) {
      accum[index] = 0;
      accum[index + 1] = 1;
    }
    return accum;
  }, [] as number[]).map(val => {
    if (val === -2) return "=";
    if (val === -1) return "-";
    return val.toString();
  });

  return base5.reverse().join("");
}

function fromSNAFU(string: string) {
  return string.split("").reverse().reduce((accum, val, index) => {
    const placeValue = Math.pow(5, index);

    let parsedNumber = Number.parseInt(val);
    if (Number.isNaN(parsedNumber)) {
      if (val === "-") {
        parsedNumber = -1;
      } else if (val === "=") {
        parsedNumber = -2;
      }
    }
    accum += placeValue * parsedNumber;
    return accum;
  }, 0);
}

const part1 = (rawInput: string) => {
  const strings = parseInput(rawInput);
  const parsedNumbers = strings.map(fromSNAFU);
  const sum = parsedNumbers.reduce((accum, val) => {
    return accum + val
  }, 0);

  return toSNAFU(sum);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`,
        expected: "2=-1=0",
      },
      {
        input: `2-==10--=-0101==1201`,
        expected: "2-==10--=-0101==1201",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});


