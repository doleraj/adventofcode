import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map(n => BigInt(n));

const mix = (secret: bigint, mixer: bigint) => {
  return secret ^ mixer;
}

const prune = (secret: bigint) => {
  return secret % 16777216n;
}

const evolve = (current: bigint) => {
  let secretNumber = current;
  const mult1Result = secretNumber * 64n;
  secretNumber = mix(secretNumber, mult1Result);
  secretNumber = prune(secretNumber);
  const divResult = secretNumber / 32n;
  secretNumber = mix(secretNumber, divResult);
  secretNumber = prune(secretNumber);
  const mult2Result = secretNumber * 2048n;
  secretNumber = mix(secretNumber, mult2Result);
  return prune(secretNumber);
}

const part1 = (rawInput: string) => {
  const secretNumbers = parseInput(rawInput);

  const result = secretNumbers.reduce((output, current) => {
    let next = current;
    for (let iteration = 0; iteration < 2000; iteration++) {
      next = evolve(next);
    }

    return output + next;
  }, 0n);

  return result.toString(10);
};

const part2 = (rawInput: string) => {
  const secretNumbers = parseInput(rawInput);
  // const sellerMap = new Map<bigint, { prices: bigint[]; deltas: bigint[]; }>
  const sellerSequenceMap = new Map<bigint, Map<string, bigint>>();

  for (let seller of secretNumbers) {
    const sequenceMap = new Map<string, bigint>();
    let next = seller;
    let lastPrice = seller % 10n;
    let deltas: bigint[] = [];
    for (let iteration = 0; iteration < 2000; iteration++) {
      next = evolve(next);
      const price = next % 10n;
      deltas.push(price - lastPrice);
      lastPrice = price;

      if (iteration >= 3) {
        const key = `${deltas[iteration - 3]},${deltas[iteration - 2]},${deltas[iteration - 1]},${deltas[iteration]}`;
        if (!sequenceMap.has(key)) {
          sequenceMap.set(key, price);
        }
      }

    }
    // sellerMap.set(seller, { prices, deltas });
    sellerSequenceMap.set(seller, sequenceMap);
  }

  let sellerInt = 0;
  const sellerMaxSums = Array(...sellerSequenceMap.keys()).map((sellerNumber) => {
    const localSellerSequenceMap = sellerSequenceMap.get(sellerNumber)!!;
    console.log(`Looking at seller number: ${sellerInt++}`);

    const priceSumsForSequences = Array(...localSellerSequenceMap.keys()).map(key => {
      return Array(...sellerSequenceMap.entries()).reduce((sum, entry) => {
        if (sellerNumber === entry[0]) {
          return sum;
        }

        const sellerSequenceMap = entry[1];
        if (sellerSequenceMap.has(key)) {
          sum += sellerSequenceMap.get(key)!!;
        }
        return sum;
      }, localSellerSequenceMap.get(key)!!);
    });

    priceSumsForSequences.sort((a, b) => a > b ? -1 : 1);
    return priceSumsForSequences[0];
  });

  sellerMaxSums.sort((a, b) => a > b ? -1 : 1);
  return sellerMaxSums[0].toString(10);
}

run({
  part1: {
    tests: [
      {
        input: `
1
10
100
2024`,
        expected: "37327623",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1
2
3
2024`,
        expected: "23",
      },
    ],
    // 1384 too low
    // 1463 too low
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
