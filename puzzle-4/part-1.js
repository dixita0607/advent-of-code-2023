const fs = require("fs");
const path = require("path");
const readline = require("readline");

const getNumbersFromCard = (card) => {
  const [cardName, cardNumbers] = card.split(":");
  return cardNumbers
    .trim()
    .split("|")
    .map((numbers) =>
      numbers
        .trim()
        .split(" ")
        .filter((number) => !!number)
    );
};

const main = () => {
  const readableStream = fs.createReadStream(
    path.join(__dirname, "./input.txt")
  );
  const rl = readline.createInterface({ input: readableStream });

  let totalOfWinningPoints = 0;

  rl.on("line", (card) => {
    const [winningNumbers, scratchedNumbers] = getNumbersFromCard(card);
    const totalOfThisCard = scratchedNumbers.reduce(
      (doubled, scratchedNumber) => {
        if (winningNumbers.indexOf(scratchedNumber) >= 0) {
          return doubled === 0 ? doubled + 1 : doubled * 2;
        }
        return doubled;
      },
      0
    );
    totalOfWinningPoints = totalOfWinningPoints + totalOfThisCard;
  });

  rl.on("close", () => {
    console.log("The answer is:", totalOfWinningPoints);
  });
};

main();
