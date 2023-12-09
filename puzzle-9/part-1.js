const fs = require("fs");
const path = require("path");
const readline = require("readline");

const isAllZero = (numbers) => {
  for (number of numbers) {
    if (number !== 0) return false;
  }
  return true;
};

const getToZero = (numbers, history) => {
  history.push(numbers);
  if (isAllZero(numbers)) return history;
  const diffs = numbers.reduce((diff, num, index) => {
    if (index !== 0) {
      diff.push(num - numbers[index - 1]);
    }
    return diff;
  }, []);
  return getToZero(diffs, history);
};

const main = () => {
  const readStream = fs.createReadStream(path.join(__dirname, "./input.txt"));
  const rl = readline.createInterface({ input: readStream });

  let total = 0;

  rl.on("line", (line) => {
    const numbers = line.split(" ").map((num) => Number(num));
    const numbersTillZeroes = getToZero(numbers, []).reverse();
    total =
      total +
      numbersTillZeroes.reduce((newNum, currentNums, index) => {
        if (index === 0) {
          currentNums.push(0);
          return newNum;
        }
        return newNum + currentNums[currentNums.length - 1];
      }, 0);
  });

  rl.on("close", () => console.log("The answer is:", total));
};

main();
