const fs = require("fs");
const path = require("path");
const readline = require("readline");

const getNumbersFromCard = (card) => {
  const [cardName, cardNumbers] = card.split(":");
  return {
    card: cardName.split(" ").filter((str) => !!str)[1],
    cardNumbers: cardNumbers
      .trim()
      .split("|")
      .map((numbers) =>
        numbers
          .trim()
          .split(" ")
          .filter((number) => !!number)
      ),
  };
};

const getNumberOfWins = (winningNumbers, scratchedNumbers) =>
  scratchedNumbers.reduce((wins, number) => {
    if (winningNumbers.indexOf(number) >= 0) {
      return wins + 1;
    }
    return wins;
  }, 0);

const main = () => {
  const readableStream = fs.createReadStream(
    path.join(__dirname, "./input.txt")
  );
  const rl = readline.createInterface({ input: readableStream });

  let totalNumberOfAllCardsOccurrences = 0;
  const cardOccurrences = {};

  rl.on("line", (card) => {
    const {
      card: cardName,
      cardNumbers: [winningNumbers, scratchedNumbers],
    } = getNumbersFromCard(card);

    const numberOfWinsForThisCard = getNumberOfWins(
      winningNumbers,
      scratchedNumbers
    );
    if (!cardOccurrences[cardName]) {
      cardOccurrences[cardName] = 1;
    }
    totalNumberOfAllCardsOccurrences =
      totalNumberOfAllCardsOccurrences + cardOccurrences[cardName];
    for (let i = 0; i < cardOccurrences[cardName]; i++) {
      for (let j = 0; j < numberOfWinsForThisCard; j++) {
        const nextCard = Number(cardName) + j + 1;
        if (!cardOccurrences[nextCard]) {
          cardOccurrences[nextCard] = 1;
        }
        cardOccurrences[nextCard] = cardOccurrences[nextCard] + 1;
      }
    }
  });

  rl.on("close", () => {
    console.log("The answer is:", totalNumberOfAllCardsOccurrences);
  });
};

main();
