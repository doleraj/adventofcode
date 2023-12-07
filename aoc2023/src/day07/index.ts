import run from "aocrunner";
import "../utils/index.js";

enum Hands {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines.map(line => {
    const matches = line.match(/([AKQJT987654321]{5}) (\d+)/)!!;
    const hand = matches[1].split("");
    const bid = Number.parseInt(matches[2]);

    return { hand, bid };
  });
}

const getNumberForCard = (card: string) => {
  let cardNumber = Number.parseInt(card);
  if (cardNumber) {
    return cardNumber;
  }

  switch (card) {
    case "T": return 10;
    case "J": return 11;
    case "Q": return 12;
    case "K": return 13;
    case "A": return 14;
  }
  return -1;
}



const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const handsWithTypes = lines.map(line => {
    const { hand, bid } = line;

    const groupedWithCounts = hand.countGroups(card => card);
    const counts = Object.values(groupedWithCounts).sort().reverse();

    if (counts[0] === 5) {
      return { hand, bid, type: Hands.FIVE_OF_A_KIND };
    } else if (counts[0] === 4) {
      return { hand, bid, type: Hands.FOUR_OF_A_KIND };
    } else if (counts[0] === 3 && counts[1] === 2) {
      return { hand, bid, type: Hands.FULL_HOUSE };
    } else if (counts[0] === 3) {
      return { hand, bid, type: Hands.THREE_OF_A_KIND };
    } else if (counts[0] === 2 && counts[1] === 2) {
      return { hand, bid, type: Hands.TWO_PAIR };
    } else if (counts[0] === 2) {
      return { hand, bid, type: Hands.ONE_PAIR };
    } else {
      return { hand, bid, type: Hands.HIGH_CARD };
    }
  });

  handsWithTypes.sort((a, b) => {
    if (a.type > b.type) { return 1; }
    if (a.type < b.type) { return -1; }

    for (let i = 0; i < 5; i++) {
      let aCardNumber = getNumberForCard(a.hand[i]);
      let bCardNumber = getNumberForCard(b.hand[i]);

      if (aCardNumber > bCardNumber) { return 1; }
      if (aCardNumber < bCardNumber) { return -1; }
    }
    return 0;
  });

  const winnings = handsWithTypes.map((hand, index) => hand.bid * (index + 1));
  return winnings.reduce((accum, win) => accum + win, 0);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const handsWithTypes = lines.map(line => {
    const { hand, bid } = line;

    const groupedWithCounts = hand.countGroups(card => card);
    const numberOfJokers = groupedWithCounts["J"] || 0;
    delete groupedWithCounts["J"];
    const counts = Object.values(groupedWithCounts).sort().reverse();
    // console.log(counts);

    if (counts[0] + numberOfJokers === 5 || numberOfJokers === 5) {
      return { hand, bid, type: Hands.FIVE_OF_A_KIND };
    } else if (counts[0] + numberOfJokers=== 4) {
      return { hand, bid, type: Hands.FOUR_OF_A_KIND };
    } else if (counts[0] + numberOfJokers === 3 && counts[1] === 2) {
      return { hand, bid, type: Hands.FULL_HOUSE };
    } else if (counts[0] + numberOfJokers === 3) {
      return { hand, bid, type: Hands.THREE_OF_A_KIND };
    } else if (counts[0] + numberOfJokers === 2 && counts[1] === 2) {
      return { hand, bid, type: Hands.TWO_PAIR };
    } else if (counts[0] + numberOfJokers === 2) {
      return { hand, bid, type: Hands.ONE_PAIR };
    } else {
      return { hand, bid, type: Hands.HIGH_CARD };
    }
  });

  handsWithTypes.sort((a, b) => {
    if (a.type > b.type) { return 1; }
    if (a.type < b.type) { return -1; }

    for (let i = 0; i < 5; i++) {
      let aCardNumber = getNumberForCard(a.hand[i]);
      aCardNumber = aCardNumber === 11 ? 0 : aCardNumber;
      let bCardNumber = getNumberForCard(b.hand[i]);
      bCardNumber = bCardNumber === 11 ? 0 : bCardNumber;

      if (aCardNumber > bCardNumber) { return 1; }
      if (aCardNumber < bCardNumber) { return -1; }
    }
    return 0;
  });
  console.log(handsWithTypes);
  const winnings = handsWithTypes.map((hand, index) => hand.bid * (index + 1));

  // 252609848 too low
  // 252904199 too low
  // 252919083 too low
  // 253359364 too low
  // 253718982 not right
  // 253888522 not right
  // 254083736
  // 254138190 too high
  return winnings.reduce((accum, win) => accum + win, 0);
};


run({
  part1: {
    tests: [
      {
        input: `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
