import { max, readLines, sum, memoize } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => {
    const [hand, bid] = line.split(" ");
    return [hand.split(""), bid];
  });

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

// J is now a Joker (with smallest value)
const cardsPart2 = [...cards.filter((card) => card !== "J"), "J"];

const replaceAndCombine = (
  originalArray,
  targetElement,
  replacementOptions
) => {
  const targetIndex = originalArray.indexOf(targetElement);

  if (targetIndex === -1) {
    return [originalArray];
  }

  return replacementOptions.flatMap((replacement) => {
    const newArray = [...originalArray];
    newArray[targetIndex] = replacement;
    return replaceAndCombine(newArray, targetElement, replacementOptions);
  });
};

const xOfAKind = (hand, x) => {
  const counts = {};
  hand.forEach((card) => {
    counts[card] = (counts[card] || 0) + 1;
  });
  return Object.values(counts).includes(x);
};

const fullHouse = (hand) => {
  const counts = {};
  hand.forEach((card) => {
    counts[card] = (counts[card] || 0) + 1;
  });
  return Object.values(counts).includes(3) && Object.values(counts).includes(2);
};

const twoPair = (hand) => {
  const counts = {};
  hand.forEach((card) => {
    counts[card] = (counts[card] || 0) + 1;
  });
  return Object.values(counts).filter((count) => count === 2).length === 2;
};

const getHandValue = memoize((hand) => {
  if (xOfAKind(hand, 5)) {
    return 7;
  }
  if (xOfAKind(hand, 4)) {
    return 6;
  }
  if (fullHouse(hand)) {
    return 5;
  }
  if (xOfAKind(hand, 3)) {
    return 4;
  }
  if (twoPair(hand)) {
    return 3;
  }
  if (xOfAKind(hand, 2)) {
    return 2;
  }
  return 1;
});

const getHandValuePart2 = memoize((hand) =>
  // Find all combinations of hand when replacing J with another card
  replaceAndCombine(
    hand,
    "J",
    cardsPart2.filter((card) => card !== "J")
  ).reduce((acc, next) => max([getHandValue(next), acc]), 0)
);

const handComparator = (a, b, part2 = false) => {
  const aHandValue = part2 ? getHandValuePart2(a) : getHandValue(a);
  const bHandValue = part2 ? getHandValuePart2(b) : getHandValue(b);

  if (aHandValue < bHandValue) {
    return -1;
  }

  if (aHandValue > bHandValue) {
    return 1;
  }

  // Tiebreak - the first highest card in the hand wins
  for (let i = 0; i < a.length; i++) {
    const valueA = part2 ? cardsPart2.indexOf(a[i]) : cards.indexOf(a[i]);
    const valueB = part2 ? cardsPart2.indexOf(b[i]) : cards.indexOf(b[i]);

    if (valueA < valueB) {
      return 1;
    }

    if (valueA > valueB) {
      return -1;
    }
  }

  return 0;
};

const part1 = (input) =>
  sum(
    parseInput(input)
      .sort(([a], [b]) => handComparator(a, b))
      .map(([, bid], idx) => (idx + 1) * bid)
  );

const part2 = (input) =>
  sum(
    parseInput(input)
      .sort(([a], [b]) => handComparator(a, b, true))
      .map(([, bid], idx) => (idx + 1) * bid)
  );

export { part1, part2 };
