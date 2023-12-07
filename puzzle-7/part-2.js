const fs = require("fs").promises;
const path = require("path");

const readFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName);
    return data.toString();
  } catch (e) {
    console.error(`Got an error trying to read file: ${e.message}`);
  }
};

const cards = {
  J: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  Q: 10,
  K: 11,
  A: 12,
};

const handTypes = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPair: 2,
  onePair: 1,
  highCard: 0,
};

const getHand = (hand) =>
  hand.split("").reduce((cardMapping, card) => {
    if (cardMapping[card]) {
      cardMapping[card] = cardMapping[card] + 1;
    } else {
      cardMapping[card] = 1;
    }
    return cardMapping;
  }, Object.create(null));

const transformHand = (hand) => {
  const uniqueCards = Object.keys(hand);
  const [keyWithMaxCards] = uniqueCards
    .sort((a, b) => (hand[a] >= hand[b] ? -1 : 1))
    .filter((key) => key !== "J");
  if (uniqueCards.includes("J")) {
    const newHand = {
      ...hand,
      [keyWithMaxCards]: hand[keyWithMaxCards] + hand.J,
    };
    delete newHand.J;
    return newHand;
  } else return hand;
};

const getType = (hand) => {
  const transformedHand = transformHand(hand);
  const uniqueCards = Object.keys(transformedHand);
  switch (uniqueCards.length) {
    case 1:
      return handTypes.fiveOfAKind;
    case 2: {
      if (Object.values(transformedHand).find((value) => value === 4))
        return handTypes.fourOfAKind;
      else return handTypes.fullHouse;
    }
    case 3: {
      if (Object.values(transformedHand).find((value) => value === 3))
        return handTypes.threeOfAKind;
      else return handTypes.twoPair;
    }
    case 4:
      return handTypes.onePair;
    case 5:
      return handTypes.highCard;
    default:
      throw new Error("type not found");
  }
};

const main = async () => {
  const fileContents = (
    await readFile(path.join(__dirname, "./input.txt"))
  ).split("\n");

  const hands = fileContents
    .filter((line) => !!line)
    .map((line) => {
      const [hand, value] = line.split(" ");
      return {
        hand: hand.trim().split(""),
        value: Number(value.trim()),
        type: getType(getHand(hand)),
      };
    });

  const sequencedHands = hands.sort((a, b) => {
    if (a.type > b.type) return 1;
    if (a.type < b.type) return -1;
    if (a.type === b.type) {
      for (let i = 0; i < a.hand.length; i++) {
        if (cards[a.hand[i]] > cards[b.hand[i]]) {
          return 1;
        } else if (cards[a.hand[i]] < cards[b.hand[i]]) {
          return -1;
        }
      }
    } else return 0;
  });

  const total = sequencedHands.reduce(
    (total, card, index) => total + card.value * (index + 1),
    0
  );

  console.log("The answer is:", total);
};

main();
