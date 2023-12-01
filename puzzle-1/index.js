const fs = require("fs").promises;

const stringToDigits = Object.assign(Object.create(null), {
  one: 1,
  eno: 1,
  two: 2,
  owt: 2,
  three: 3,
  eerht: 3,
  four: 4,
  ruof: 4,
  five: 5,
  evif: 5,
  six: 6,
  xis: 6,
  seven: 7,
  neves: 7,
  eight: 8,
  thgie: 8,
  nine: 9,
  enin: 9,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
});

const getFirstDigit = (line) => {
  const re = /one|two|three|four|five|six|seven|eight|nine|[1-9]/g;
  const numbersAsString = re.exec(line);
  return stringToDigits[numbersAsString[0]];
};

const getLastDigit = (line) => {
  const re = /eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|[1-9]/g;
  const numbersAsString = re.exec(line.split("").reverse().join(""));
  return stringToDigits[numbersAsString[0]];
};

const getCalibration = (line) => {
  const firstDigit = stringToDigits[getFirstDigit(line)];
  const lastDigit = stringToDigits[getLastDigit(line)];
  return Number(`${firstDigit}${lastDigit}`);
};

const readFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName);
    return data.toString();
  } catch (e) {
    console.error(`Got an error trying to read file: ${e.message}`);
  }
};

const main = async () => {
  const fileContents = await readFile("input.txt");
  const totalCalibration = fileContents.split("\n").reduce((total, line) => {
    if (line) {
      const digitInLine = getCalibration(line);
      return total + digitInLine;
    }
    return total;
  }, 0);
  console.log("Answer:", totalCalibration);
};

main();
