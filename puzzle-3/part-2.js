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

const isGear = (c) => c === "*";

const main = async () => {
  const fileContents = await readFile(path.join(__dirname, "./input.txt"));
  const allLines = fileContents.split("\n");
  const numbersWithSameGear = allLines.reduce((ngMapping, line, lineIndex) => {
    const numbersRe = /[0-9]+/g;
    const numberMatches = line.matchAll(numbersRe);
    for (const match of numberMatches) {
      for (i = match.index; i <= match.index + match[0].length - 1; i++) {
        const currentLine = allLines[lineIndex];
        const previousLine = allLines[lineIndex - 1];
        const nextLine = allLines[lineIndex + 1];
        if (isGear(currentLine?.[i - 1])) {
          const gearPosition = `${lineIndex}${i - 1}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(currentLine?.[i + 1])) {
          const gearPosition = `${lineIndex}${i + 1}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(previousLine?.[i])) {
          const gearPosition = `${lineIndex - 1}${i}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(nextLine?.[i])) {
          const gearPosition = `${lineIndex + 1}${i}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(previousLine?.[i - 1])) {
          const gearPosition = `${lineIndex - 1}${i - 1}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(nextLine?.[i - 1])) {
          const gearPosition = `${lineIndex + 1}${i - 1}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(previousLine?.[i + 1])) {
          const gearPosition = `${lineIndex - 1}${i + 1}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
        if (isGear(nextLine?.[i + 1])) {
          const gearPosition = `${lineIndex + 1}${i + 1}`;
          if (!ngMapping[gearPosition]) {
            ngMapping[gearPosition] = [];
          }
          ngMapping[gearPosition].push(Number(match[0]));
          break;
        }
      }
    }
    return ngMapping;
  }, Object.assign(Object.create(null)));

  const totalWithGears = Object.values(numbersWithSameGear).reduce(
    (total, values) => {
      if (values.length >= 2) {
        let subTotal = 0;
        for (let i = 0; i <= values.length - 2; i = i + 2) {
          subTotal = subTotal + values[i] * values[i + 1];
        }
        return total + subTotal;
      }
      return total;
    },
    0
  );

  console.log("Answer is: ", totalWithGears);
};

main();
